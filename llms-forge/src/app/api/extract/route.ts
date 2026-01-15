import { NextRequest, NextResponse } from 'next/server'
import { extract, type ExtractionProgress, type ExtractionResult as NewExtractionResult } from '@/lib/extractor'
import { parseLlmsContent, extractSiteName, slugify, estimateTokens } from '@/lib/parser'
import { generateAllDocuments } from '@/lib/generator'
import { ExtractionResult, Document } from '@/types'

/**
 * POST endpoint - Direct extraction (non-streaming)
 * Returns complete result when extraction finishes
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { url, useNewExtractor = true } = body
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Use the new smart extractor by default
    if (useNewExtractor) {
      const result = await extract({ url })
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Extraction failed' },
          { status: 500 }
        )
      }
      
      // Transform to match existing API contract
      const documents: Document[] = result.documents.map((doc, index) => ({
        filename: `${String(index + 1).padStart(2, '0')}-${slugify(doc.title)}.md`,
        title: doc.title,
        content: doc.content,
        tokens: estimateTokens(doc.content),
      }))
      
      const fullDocument: Document = {
        filename: 'llms-full.md',
        title: `${result.source.siteName} Documentation`,
        content: result.fullDocument,
        tokens: estimateTokens(result.fullDocument),
      }
      
      const agentGuide: Document = {
        filename: 'AGENT-GUIDE.md',
        title: 'Agent Guide',
        content: result.agentPrompt,
        tokens: estimateTokens(result.agentPrompt),
      }
      
      const response: ExtractionResult = {
        url,
        sourceUrl: result.source.sourceUrl,
        rawContent: result.fullDocument,
        documents,
        fullDocument,
        agentGuide,
        stats: {
          totalTokens: result.stats.totalTokens,
          documentCount: result.stats.totalDocuments,
          processingTime: result.stats.extractionTime,
        },
      }
      
      return NextResponse.json({
        ...response,
        // Additional data from new extractor
        strategy: result.strategy,
        mcpConfig: result.mcpConfig,
      })
    }

    // Legacy extractor path (llms.txt only)
    let targetUrl = url.trim()
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`
    }

    let urlObj: URL
    try {
      urlObj = new URL(targetUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }
    
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`
    
    let content: string | null = null
    let sourceUrl: string = ''
    
    const urlsToTry = [
      `${baseUrl}/llms-full.txt`,
      `${baseUrl}/llms.txt`
    ]
    
    for (const tryUrl of urlsToTry) {
      try {
        const response = await fetch(tryUrl, {
          headers: {
            'User-Agent': 'llms-forge/1.0 (Documentation Extractor)',
          },
        })
        
        if (response.ok) {
          content = await response.text()
          sourceUrl = tryUrl
          break
        }
      } catch {
        continue
      }
    }
    
    if (!content) {
      return NextResponse.json(
        { error: `No llms.txt or llms-full.txt found at ${urlObj.host}` },
        { status: 404 }
      )
    }
    
    const parsedDocuments = parseLlmsContent(content)
    
    if (parsedDocuments.length === 0) {
      return NextResponse.json(
        { error: 'No content could be parsed from the documentation' },
        { status: 422 }
      )
    }
    
    const { documents, fullDocument, agentGuide } = generateAllDocuments(
      parsedDocuments,
      content,
      sourceUrl
    )
    
    const totalTokens = documents.reduce((sum, doc) => sum + doc.tokens, 0) 
      + fullDocument.tokens 
      + agentGuide.tokens
    
    const processingTime = Date.now() - startTime
    
    const result: ExtractionResult = {
      url: targetUrl,
      sourceUrl,
      rawContent: content,
      documents,
      fullDocument,
      agentGuide,
      stats: {
        totalTokens,
        documentCount: documents.length,
        processingTime
      }
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Extraction failed' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint - Streaming extraction with Server-Sent Events
 * Returns progress updates in real-time
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json(
      { error: 'URL is required' },
      { status: 400 }
    )
  }

  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      let finalResult: NewExtractionResult | null = null
      
      try {
        finalResult = await extract({
          url,
          onProgress: (progress: ExtractionProgress) => {
            const data = JSON.stringify(progress)
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          },
        })
        
        // Send final result
        const resultData = JSON.stringify({
          type: 'result',
          data: finalResult,
        })
        controller.enqueue(encoder.encode(`data: ${resultData}\n\n`))
        
      } catch (error) {
        const errorData = JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Extraction failed',
        })
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}

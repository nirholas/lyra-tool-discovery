import { NextRequest, NextResponse } from 'next/server'
import { parseLlmsContent, extractSiteName } from '@/lib/parser'
import { generateAllDocuments } from '@/lib/generator'
import { ExtractionResult } from '@/types'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Parse and normalize the URL
    let targetUrl = url.trim()
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`
    }

    // Extract base domain
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
    
    // Try llms-full.txt first, then fallback to llms.txt
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
            'User-Agent': 'LLMs-Forge/1.0 (Documentation Extractor)',
          },
        })
        
        if (response.ok) {
          content = await response.text()
          sourceUrl = tryUrl
          break
        }
      } catch {
        // Continue to next URL
        continue
      }
    }
    
    if (!content) {
      return NextResponse.json(
        { error: `No llms.txt or llms-full.txt found at ${urlObj.host}` },
        { status: 404 }
      )
    }
    
    // Parse the content into documents
    const parsedDocuments = parseLlmsContent(content)
    
    if (parsedDocuments.length === 0) {
      return NextResponse.json(
        { error: 'No content could be parsed from the documentation' },
        { status: 422 }
      )
    }
    
    // Generate all output documents
    const { documents, fullDocument, agentGuide } = generateAllDocuments(
      parsedDocuments,
      content,
      sourceUrl
    )
    
    // Calculate statistics
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

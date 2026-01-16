import { NextRequest, NextResponse } from 'next/server'

/**
 * GET endpoint - Download llms-full.txt as docs.md
 * Usage: /api/download?url=docs.axiom.trade&filename=axiom-docs.md
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  const filename = request.nextUrl.searchParams.get('filename') || 'docs.md'
  
  if (!url) {
    return NextResponse.json(
      { error: 'URL is required as query parameter. Usage: /api/download?url=example.com' },
      { status: 400 }
    )
  }

  try {
    // Normalize URL
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
    
    // Try to fetch llms-full.txt first, then llms.txt
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
    
    // Add header comment with source info
    const siteName = urlObj.host.replace('www.', '')
    const header = `<!-- 
  Source: ${sourceUrl}
  Extracted: ${new Date().toISOString()}
  Site: ${siteName}
-->\n\n`
    
    const finalContent = header + content

    // Return as downloadable file
    return new NextResponse(finalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Source-URL': sourceUrl,
      },
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Download failed' },
      { status: 500 }
    )
  }
}

/**
 * POST endpoint - Download with custom options
 * Body: { url: string, filename?: string, includeHeader?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, filename = 'docs.md', includeHeader = true } = body
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Normalize URL
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
    
    // Try to fetch llms-full.txt first, then llms.txt
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
    
    // Optionally add header comment
    let finalContent = content
    if (includeHeader) {
      const siteName = urlObj.host.replace('www.', '')
      const header = `<!-- 
  Source: ${sourceUrl}
  Extracted: ${new Date().toISOString()}
  Site: ${siteName}
-->\n\n`
      finalContent = header + content
    }

    // Return as downloadable file
    return new NextResponse(finalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Source-URL': sourceUrl,
      },
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Download failed' },
      { status: 500 }
    )
  }
}


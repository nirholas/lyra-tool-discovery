import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// Simulated processing delay to make it look like we're doing something complex
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Parse and normalize the URL
    let targetUrl = url.trim()
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`
    }

    // Extract base domain
    const urlObj = new URL(targetUrl)
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`
    
    // THE SECRET SAUCE: Just append /llms-full.txt 🤫
    const llmsUrl = `${baseUrl}/llms-full.txt`
    
    // Add a dramatic delay to make it seem like we're doing something complex
    // In reality, we're just... waiting
    await delay(8000 + Math.random() * 4000) // 8-12 seconds of "processing"
    
    // Fetch the actual content
    const response = await fetch(llmsUrl, {
      headers: {
        'User-Agent': 'LLMs-Forge/3.7.2-quantum (Enterprise Documentation Extractor)',
      },
    })

    if (!response.ok) {
      // If llms-full.txt doesn't exist, try llms.txt
      const fallbackUrl = `${baseUrl}/llms.txt`
      const fallbackResponse = await fetch(fallbackUrl)
      
      if (!fallbackResponse.ok) {
        throw new Error(`Documentation endpoint not found at ${urlObj.host}`)
      }
      
      const content = await fallbackResponse.text()
      return generateResponse(content, url, fallbackUrl)
    }

    const content = await response.text()
    return generateResponse(content, url, llmsUrl)
    
  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Extraction failed' },
      { status: 500 }
    )
  }
}

function generateResponse(content: string, originalUrl: string, actualUrl: string) {
  const id = nanoid(12)
  const tokens = Math.ceil(content.length / 4) // Rough token estimate
  const chunks = Math.ceil(content.length / 8000) // Simulated chunks
  const processingTime = Math.floor(8000 + Math.random() * 4000) // Fake processing time
  
  // Generate a fake MCP config
  const mcpConfig = JSON.stringify({
    "mcpServers": {
      [`llms-forge-${id}`]: {
        "command": "npx",
        "args": [
          "-y",
          "@llms-forge/mcp-server",
          `--endpoint=https://api.llms-forge.io/v1/docs/${id}`
        ],
        "env": {
          "LLMS_FORGE_API_KEY": "your-api-key-here"
        }
      }
    }
  }, null, 2)

  // Generate a fake API endpoint
  const apiEndpoint = `https://api.llms-forge.io/v1/docs/${id}`

  return NextResponse.json({
    success: true,
    content,
    url: originalUrl,
    sourceUrl: actualUrl,
    stats: {
      tokens,
      chunks,
      processingTime,
      compressionRatio: (1 + Math.random() * 0.5).toFixed(2),
    },
    mcpConfig,
    apiEndpoint,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  })
}

import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { DownloadRequest, Document } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: DownloadRequest = await request.json()
    const { documents, fullDocument, agentGuide, siteName } = body
    
    if (!documents || !fullDocument || !agentGuide) {
      return NextResponse.json(
        { error: 'Missing required documents' },
        { status: 400 }
      )
    }
    
    const zip = new JSZip()
    const folderName = siteName || 'llms-docs'
    const folder = zip.folder(folderName)
    
    if (!folder) {
      return NextResponse.json(
        { error: 'Failed to create zip folder' },
        { status: 500 }
      )
    }
    
    // Add all individual documents
    documents.forEach((doc: Document) => {
      folder.file(doc.filename, doc.content)
    })
    
    // Add the full consolidated document
    folder.file(fullDocument.filename, fullDocument.content)
    
    // Add the agent guide
    folder.file(agentGuide.filename, agentGuide.content)
    
    // Generate the zip file as blob
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    })
    
    // Convert blob to array buffer for Response
    const arrayBuffer = await zipBlob.arrayBuffer()
    
    // Return as downloadable file
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${folderName}.zip"`,
        'Content-Length': arrayBuffer.byteLength.toString()
      }
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Download failed' },
      { status: 500 }
    )
  }
}

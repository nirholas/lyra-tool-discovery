export interface Document {
  filename: string
  title: string
  content: string
  tokens: number
}

export type ExtractionState = 'idle' | 'extracting' | 'complete' | 'error'

export interface ExtractionResult {
  url: string
  sourceUrl: string
  rawContent: string
  documents: Document[]
  fullDocument: Document
  agentGuide: Document
  stats: {
    totalTokens: number
    documentCount: number
    processingTime: number
  }
}

export interface DownloadRequest {
  documents: Document[]
  fullDocument: Document
  agentGuide: Document
  siteName: string
}

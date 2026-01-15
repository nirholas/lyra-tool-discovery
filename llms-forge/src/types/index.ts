export interface Document {
  filename: string
  title: string
  content: string
  tokens: number
}

export interface MarkdownDocument {
  title: string
  url: string
  content: string
  wordCount: number
}

export type ExtractionState = 'idle' | 'extracting' | 'complete' | 'error'

export interface ExtractionProgress {
  status: 'idle' | 'analyzing' | 'fetching' | 'processing' | 'complete' | 'error'
  message: string
  progress: number
  currentStep?: string
  totalSteps?: number
  completedSteps?: number
  logs: string[]
}

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

export interface UrlAnalysis {
  originalUrl: string
  baseUrl: string
  strategy: 'llms-txt' | 'sitemap' | 'docs-discovery' | 'html-scrape'
  llmsTxtUrl: string | null
  sitemapUrl: string | null
  docsUrl: string | null
  pages: string[]
}

export interface DownloadRequest {
  documents: Document[]
  fullDocument: Document
  agentGuide: Document
  siteName: string
}

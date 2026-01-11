import { NextRequest, NextResponse } from 'next/server';

// Mock templates for demonstration
// TODO: Replace with real analysis using the lyra-tool-discovery package
const MOCK_TEMPLATES = [
  'basic',
  'default',
  'markdown',
  'openapi',
  'settings',
  'standalone',
  'mcp-http',
  'mcp-stdio',
];

interface AnalyzeRequest {
  url?: string;
  package?: string;
}

interface AnalysisResult {
  success: boolean;
  source: 'github' | 'npm';
  name: string;
  template: string;
  confidence: number;
  metadata: {
    description?: string;
    stars?: number;
    downloads?: number;
    lastUpdated?: string;
  };
  config: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    // Validate input
    if (!body.url && !body.package) {
      return NextResponse.json(
        { error: 'Either "url" (GitHub repository) or "package" (npm package) is required' },
        { status: 400 }
      );
    }

    // Determine source type
    const source = body.url ? 'github' : 'npm';
    const name = body.url 
      ? body.url.replace('https://github.com/', '').replace('.git', '')
      : body.package!;

    // TODO: Implement real analysis using lyra-tool-discovery
    // For now, return mock data
    
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock result
    const template = MOCK_TEMPLATES[Math.floor(Math.random() * MOCK_TEMPLATES.length)];
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%

    const result: AnalysisResult = {
      success: true,
      source,
      name,
      template,
      confidence,
      metadata: {
        description: `A ${template} plugin discovered from ${source}`,
        stars: source === 'github' ? Math.floor(Math.random() * 1000) : undefined,
        downloads: source === 'npm' ? Math.floor(Math.random() * 10000) : undefined,
        lastUpdated: new Date().toISOString(),
      },
      config: {
        name: name.split('/').pop(),
        version: '1.0.0',
        template,
        ...(template.startsWith('mcp-') && {
          transport: template === 'mcp-http' ? 'http' : 'stdio',
          command: 'node',
          args: ['./server.js'],
        }),
        ...(template === 'openapi' && {
          spec: './openapi.yaml',
          baseUrl: 'https://api.example.com',
        }),
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze. Please check your input and try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to analyze a repository or package',
    endpoints: {
      analyze: {
        method: 'POST',
        body: {
          url: 'GitHub repository URL (e.g., https://github.com/owner/repo)',
          package: 'npm package name (e.g., @scope/package)',
        },
      },
    },
  });
}

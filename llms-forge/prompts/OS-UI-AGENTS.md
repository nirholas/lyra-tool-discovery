# 4 Agent Prompts: OS-Themed UI Rebuild

> Run these 4 Claude Opus 4.5 agents in parallel. Each owns specific files and responsibilities.
> Combined, they create a polished OS experience that's better than NovaOS.

---

## Agent 1: Desktop Shell & Window System

```markdown
# Agent 1: Desktop Shell & Window System

## Your Role
You are the OS shell architect. You create the foundational desktop environment: background, window management system, and taskbar. Everything else sits on top of your work.

## Files You Own (Create/Modify)
- `src/components/os/Desktop.tsx` - Main desktop container with background
- `src/components/os/Window.tsx` - Draggable, resizable window component
- `src/components/os/Taskbar.tsx` - Bottom taskbar with app icons
- `src/components/os/WindowManager.tsx` - Context for managing window state
- `src/app/extract/page.tsx` - Main page composition (coordinate with other agents)
- `public/wallpaper.png` - You'll reference this (use a gradient fallback)

## DO NOT TOUCH (Other agents own these)
- TerminalWindow.tsx (Agent 2)
- CodeEditor.tsx (Agent 3)  
- FileManager.tsx, DownloadPanel.tsx (Agent 4)

## Design Requirements

### Desktop Background
Create a premium dark gradient background that beats NovaOS:
```css
/* Target aesthetic: Dark, professional, subtle depth */
background: 
  radial-gradient(ellipse at 20% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 100%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
  radial-gradient(ellipse at 50% 50%, #0f0f0f 0%, #000000 100%);
```
Add subtle noise texture overlay for depth. Support custom wallpaper images.

### Window Component Requirements
```typescript
interface WindowProps {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  resizable?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
}
```

Window features needed:
1. **Draggable** - Drag by title bar, constrained to viewport
2. **Resizable** - Drag corners/edges (optional per window)
3. **Z-index management** - Click to focus brings to front
4. **Minimize/Maximize/Close** buttons (traffic light style, LEFT side like Linux)
5. **Smooth animations** - Spring physics on open/close, subtle scale on drag
6. **Glass morphism** - Frosted glass title bar with backdrop blur

Window chrome styling:
```css
/* Title bar */
.window-titlebar {
  height: 38px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  /* Traffic light buttons on LEFT */
}

/* Window body */
.window-body {
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
}
```

### WindowManager Context
```typescript
interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  isFocused: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowManagerContextType {
  windows: Map<string, WindowState>;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  registerWindow: (id: string, initialState: Partial<WindowState>) => void;
  getTopZIndex: () => number;
}
```

### Taskbar Requirements
- Fixed to bottom, 48px height
- Glass morphism background
- Left: "Activities" or logo button
- Center: Open app icons with active indicator dots
- Right: System tray (time, wifi icon, battery mockup)

App icons in taskbar:
```typescript
const apps = [
  { id: 'terminal', icon: Terminal, label: 'Terminal', color: '#22c55e' },
  { id: 'editor', icon: Code, label: 'Editor', color: '#3b82f6' },
  { id: 'files', icon: Folder, label: 'Files', color: '#f59e0b' },
];
```

Clicking taskbar icon:
- If window closed → open it
- If window open but not focused → focus it
- If window focused → minimize it

### Animation Standards
Use Framer Motion for all animations:
```typescript
// Window open
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ type: 'spring', damping: 25, stiffness: 300 }}

// Window close
exit={{ opacity: 0, scale: 0.95 }}
transition={{ duration: 0.15 }}
```

## Success Criteria
- [ ] Desktop renders with beautiful gradient background
- [ ] Windows are draggable and stay within viewport bounds
- [ ] Windows can be resized (optional per window)
- [ ] Click window to bring to front (z-index)
- [ ] Traffic light buttons work (close, minimize, maximize)
- [ ] Taskbar shows open apps with active indicators
- [ ] Taskbar click behavior works correctly
- [ ] All animations are smooth (60fps)
- [ ] WindowManager context is properly set up
- [ ] No TypeScript errors
```

---

## Agent 2: Terminal Window & Extraction Engine

```markdown
# Agent 2: Terminal Window & Extraction Engine

## Your Role
You own the terminal experience and extraction logic. Users watch their docs get extracted in a beautiful terminal with real-time progress, colored output, and satisfying animations.

## Files You Own (Create/Modify)
- `src/components/os/TerminalWindow.tsx` - Terminal UI with logs
- `src/lib/extractor.ts` - Extraction logic and progress reporting
- `src/hooks/useExtraction.ts` - React hook for extraction state
- `src/types/extraction.ts` - TypeScript types for extraction

## DO NOT TOUCH (Other agents own these)
- Desktop.tsx, Window.tsx, Taskbar.tsx (Agent 1)
- CodeEditor.tsx (Agent 3)
- FileManager.tsx, DownloadPanel.tsx (Agent 4)

## Terminal Design Requirements

### Visual Style
```css
.terminal {
  background: #0a0a0a;
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.terminal-prompt {
  color: #22c55e; /* Green for prompt */
}

.terminal-command {
  color: #e2e8f0; /* Light for commands */
}
```

### Log Types & Colors
```typescript
type LogType = 'info' | 'success' | 'warning' | 'error' | 'command' | 'output';

const logColors = {
  info: '#94a3b8',      // Slate
  success: '#22c55e',   // Green
  warning: '#f59e0b',   // Amber
  error: '#ef4444',     // Red
  command: '#22c55e',   // Green (prompt)
  output: '#e2e8f0',    // Light
};

const logPrefixes = {
  info: '[INFO]',
  success: '[OK]',
  warning: '[WARN]',
  error: '[ERROR]',
  command: '$',
  output: '',
};
```

### Terminal Features
1. **Typewriter effect** - Logs appear with typing animation (40-80ms per log)
2. **Auto-scroll** - Always scroll to bottom as new logs appear
3. **Progress bar** - ASCII progress bar for overall progress
4. **Blinking cursor** - At the end of output
5. **Selectable text** - Users can copy terminal output

### Progress Bar Component
```typescript
function ProgressBar({ progress }: { progress: number }) {
  const filled = Math.floor(progress / 5);
  const empty = 20 - filled;
  return (
    <span className="text-cyan-400">
      [{`${'█'.repeat(filled)}${'░'.repeat(empty)}`}] {progress}%
    </span>
  );
}
```

### Extraction Hook Interface
```typescript
interface ExtractionState {
  status: 'idle' | 'analyzing' | 'fetching' | 'processing' | 'complete' | 'error';
  progress: number;
  logs: LogEntry[];
  result: ExtractionResult | null;
  error: string | null;
}

interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  timestamp: number;
}

interface ExtractionResult {
  url: string;
  siteName: string;
  documents: MarkdownDocument[];
  stats: {
    totalDocuments: number;
    totalWords: number;
    extractionTime: number;
  };
}

function useExtraction(): {
  state: ExtractionState;
  extract: (url: string) => Promise<void>;
  reset: () => void;
};
```

### Extraction Flow & Logs
When user submits a URL, show this sequence:
```
$ llm-forge extract https://docs.example.com

[INFO] Initializing extraction engine...
[INFO] Analyzing URL structure...
[OK] Detected: Documentation site
[OK] Found llms.txt at https://docs.example.com/llms.txt
[INFO] Fetching documentation pages...

[████████████░░░░░░░░] 60%

[OK] Section 1/12: Getting Started
[OK] Section 2/12: Installation
[OK] Section 3/12: Configuration
...
[OK] Section 12/12: API Reference

[INFO] Processing content...
[OK] Generated FULL-DOCUMENTATION.md (24,521 words)
[OK] Generated AGENT-PROMPT.md
[OK] Generated mcp-config.json
[OK] Created 12 section files

[████████████████████] 100%

✓ Extraction complete! 12 documents extracted in 3.2s

Ready to download. Check the Files panel →
```

### TerminalWindow Component
```typescript
interface TerminalWindowProps {
  url: string | null;
  extractionState: ExtractionState;
  onComplete?: () => void;
}

export default function TerminalWindow({ 
  url, 
  extractionState,
  onComplete 
}: TerminalWindowProps) {
  // Render inside Agent 1's Window component
  // Handle typewriter effect for logs
  // Show progress bar
  // Auto-scroll behavior
}
```

### Integration with Extraction API
Connect to existing API or implement client-side extraction:
```typescript
// Option 1: Real API call
const response = await fetch('/api/extract', {
  method: 'POST',
  body: JSON.stringify({ url }),
});

// Option 2: Demo mode with simulated progress
// Use setTimeout to simulate extraction steps
// Generate mock documents for demo
```

Implement BOTH - real extraction when API available, demo mode as fallback.

## Success Criteria
- [ ] Terminal renders with authentic styling (monospace, dark bg)
- [ ] Logs appear with typewriter animation
- [ ] Different log types have correct colors and prefixes
- [ ] Progress bar updates smoothly
- [ ] Auto-scroll works as logs appear
- [ ] Blinking cursor at end of output
- [ ] useExtraction hook manages all state
- [ ] Extraction completes with result data
- [ ] Demo mode works when API unavailable
- [ ] Communicates completion to other components
- [ ] No TypeScript errors
```

---

## Agent 3: Code Editor Window

```markdown
# Agent 3: Code Editor Window

## Your Role
You create a beautiful code editor for previewing extracted documentation. Users can browse their extracted markdown files, see syntax highlighting, and verify content before downloading.

## Files You Own (Create/Modify)
- `src/components/os/CodeEditor.tsx` - Main editor window component
- `src/components/os/EditorTabs.tsx` - Tab bar for multiple files
- `src/components/os/MarkdownPreview.tsx` - Rendered markdown preview (split view)
- `src/lib/syntax-highlighting.ts` - Syntax highlighting utilities

## DO NOT TOUCH (Other agents own these)
- Desktop.tsx, Window.tsx, Taskbar.tsx (Agent 1)
- TerminalWindow.tsx, extractor.ts (Agent 2)
- FileManager.tsx, DownloadPanel.tsx (Agent 4)

## Dependencies
Add to package.json if not present:
```json
{
  "dependencies": {
    "prism-react-renderer": "^2.3.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0"
  }
}
```

## Editor Design Requirements

### Visual Style (VS Code-inspired, but cleaner)
```css
.editor {
  background: #1e1e1e;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.editor-gutter {
  background: #1a1a1a;
  color: #6b7280;
  width: 50px;
  text-align: right;
  padding-right: 12px;
  user-select: none;
}

.editor-content {
  padding: 0 16px;
}
```

### Color Scheme (Custom dark theme)
```typescript
const syntaxColors = {
  comment: '#6b7280',
  keyword: '#c792ea',
  string: '#c3e88d',
  number: '#f78c6c',
  function: '#82aaff',
  variable: '#f07178',
  heading: '#89ddff',
  bold: '#ffffff',
  italic: '#c792ea',
  link: '#82aaff',
  code: '#c3e88d',
  list: '#f78c6c',
};
```

### Tab Bar Component
```typescript
interface EditorTab {
  id: string;
  filename: string;
  content: string;
  language: 'markdown' | 'json' | 'text';
  isModified: boolean;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
}
```

Tab styling:
- Height: 35px
- Background: slightly lighter than editor
- Active tab: brighter with accent border-bottom
- Show file icon based on extension
- Show dot indicator if modified
- Scrollable if many tabs

### Editor Features
1. **Syntax highlighting** - Markdown, JSON, plain text
2. **Line numbers** - Gutter with line numbers
3. **Active line highlight** - Subtle highlight on current line
4. **Word wrap** - Toggle-able, default on for markdown
5. **Split view** - Code on left, rendered preview on right (for markdown)
6. **Search** - Cmd/Ctrl+F to search in file (stretch goal)

### Markdown Preview Panel
When viewing .md files, show split view:
```typescript
<div className="flex h-full">
  {/* Code view - 50% */}
  <div className="w-1/2 border-r border-neutral-800">
    <CodeView content={content} language="markdown" />
  </div>
  
  {/* Preview - 50% */}
  <div className="w-1/2 overflow-auto p-6 prose prose-invert">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  </div>
</div>
```

### Toolbar
Above the tabs, minimal toolbar:
```typescript
const tools = [
  { icon: Copy, label: 'Copy', action: copyToClipboard },
  { icon: Download, label: 'Download', action: downloadFile },
  { icon: Columns, label: 'Split View', action: toggleSplit },
  { icon: WrapText, label: 'Word Wrap', action: toggleWrap },
];
```

### Integration with Extraction Result
Receive files from extraction:
```typescript
interface CodeEditorWindowProps {
  files: Array<{
    filename: string;
    content: string;
    type: 'full' | 'section' | 'config' | 'prompt';
  }>;
  initialFile?: string; // Which file to show first
}
```

Auto-open FULL-DOCUMENTATION.md when extraction completes.

### Component Structure
```typescript
export default function CodeEditor({ files, initialFile }: CodeEditorWindowProps) {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);

  // Initialize tabs from files
  useEffect(() => {
    if (files.length > 0) {
      const newTabs = files.map(f => ({
        id: f.filename,
        filename: f.filename,
        content: f.content,
        language: getLanguage(f.filename),
        isModified: false,
      }));
      setTabs(newTabs);
      setActiveTabId(initialFile || newTabs[0].id);
    }
  }, [files]);

  return (
    // Render toolbar, tabs, and editor content
  );
}
```

## Success Criteria
- [ ] Editor renders with beautiful syntax highlighting
- [ ] Line numbers display correctly
- [ ] Tab bar allows switching between files
- [ ] Active tab is visually distinct
- [ ] Split view shows code + rendered markdown
- [ ] Word wrap works correctly
- [ ] Copy to clipboard works
- [ ] Download individual file works
- [ ] Receives files from extraction result
- [ ] Auto-opens main doc when extraction completes
- [ ] Smooth scrolling and interactions
- [ ] No TypeScript errors
```

---

## Agent 4: File Manager & Download System

```markdown
# Agent 4: File Manager & Download System

## Your Role
You create the file manager panel that shows all generated files and provides download functionality. Users can see their extracted files organized in a tree, preview file info, and download individually or as a ZIP.

## Files You Own (Create/Modify)
- `src/components/os/FileManager.tsx` - File browser window
- `src/components/os/FileTree.tsx` - Tree view of files
- `src/components/os/FileInfo.tsx` - File details panel
- `src/components/os/DownloadPanel.tsx` - Download options (update existing)
- `src/lib/zip-builder.ts` - ZIP creation (update existing)
- `src/lib/output-generator.ts` - Output generation (update existing)

## DO NOT TOUCH (Other agents own these)
- Desktop.tsx, Window.tsx, Taskbar.tsx (Agent 1)
- TerminalWindow.tsx, extractor.ts (Agent 2)
- CodeEditor.tsx (Agent 3)

## File Manager Design Requirements

### Layout (Two-panel like Finder/Nautilus)
```
┌─────────────────────────────────────────────────┐
│ ← → ↺  │ /example-docs/                    🔍  │  <- Navigation bar
├─────────┬───────────────────────────────────────┤
│ ▼ 📁    │  Name              Size      Type    │
│   FULL..│  ────────────────────────────────    │
│   AGENT.│  📄 FULL-DOCS.md   24.5 KB   MD      │  <- File list
│   mcp-c.│  📄 AGENT-PROMPT   2.1 KB    MD      │
│   README│  📄 mcp-config     892 B     JSON    │
│ ▶ 📁 sec│  📄 README.md      1.2 KB    MD      │
│         │  📁 sections/      12 files          │
├─────────┴───────────────────────────────────────┤
│ 4 items, 28.7 KB total          [Download All] │  <- Status bar
└─────────────────────────────────────────────────┘
```

### File Tree Component
```typescript
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  children?: FileNode[];
  content?: string;
  icon?: string;
}

interface FileTreeProps {
  root: FileNode;
  selectedId: string | null;
  onSelect: (node: FileNode) => void;
  onDoubleClick: (node: FileNode) => void; // Open in editor
}
```

File icons by type:
```typescript
const fileIcons = {
  'md': { icon: FileText, color: '#3b82f6' },
  'json': { icon: Braces, color: '#f59e0b' },
  'txt': { icon: FileText, color: '#6b7280' },
  'folder': { icon: Folder, color: '#fbbf24' },
};
```

### File Info Panel (Right side or bottom)
When a file is selected, show:
```typescript
interface FileInfoProps {
  file: FileNode;
  onOpenInEditor: () => void;
  onDownload: () => void;
  onCopyContent: () => void;
}

// Display:
// - File icon (large)
// - Filename
// - File type description
// - Size
// - Word count (for markdown)
// - Action buttons
```

### Download Options
```typescript
interface DownloadPanelProps {
  outputs: GeneratedOutputs;
  siteName: string;
  onDownloadAll: () => void;
  onDownloadFile: (filename: string) => void;
}
```

Download panel in status bar or sidebar:
1. **Download All (ZIP)** - Primary action, prominent button
2. **Individual file buttons** - Secondary, in file context menu

### File Generation Structure
When extraction completes, generate this structure:
```
example-docs/
├── README.md
├── FULL-DOCUMENTATION.md
├── AGENT-PROMPT.md
├── mcp-config.json
└── sections/
    ├── 01-getting-started.md
    ├── 02-installation.md
    ├── 03-configuration.md
    └── ...
```

### ZIP Builder (Update existing)
```typescript
export async function createZipBundle(
  outputs: GeneratedOutputs,
  siteName: string,
  options?: {
    includeReadme?: boolean;
    includeSections?: boolean;
    compressionLevel?: number;
  }
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder(`${slugify(siteName)}-docs`);
  
  // Add files with progress callback
  // Return blob for download
}
```

### Context Menu
Right-click on file shows:
```typescript
const contextMenuItems = [
  { label: 'Open', icon: ExternalLink, action: 'open' },
  { label: 'Open in Editor', icon: Code, action: 'edit' },
  { label: 'Download', icon: Download, action: 'download' },
  { label: 'Copy Content', icon: Copy, action: 'copy' },
  { divider: true },
  { label: 'File Info', icon: Info, action: 'info' },
];
```

### Visual Styling
```css
.file-manager {
  background: #141414;
}

.file-tree {
  background: #1a1a1a;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.file-row {
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &.selected {
    background: rgba(59, 130, 246, 0.2);
  }
}

.file-icon {
  width: 20px;
  height: 20px;
}

.file-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  color: #6b7280;
  font-size: 12px;
}
```

### Integration
Receive data from extraction:
```typescript
interface FileManagerProps {
  outputs: GeneratedOutputs | null;
  siteName: string;
  onOpenFile: (filename: string, content: string) => void; // Opens in Editor
}
```

Double-clicking a file calls `onOpenFile` which Agent 3's editor listens to.

## Success Criteria
- [ ] File tree renders with correct hierarchy
- [ ] Files show appropriate icons by type
- [ ] File sizes display correctly (KB, MB)
- [ ] Single click selects, double click opens in editor
- [ ] Selected file shows info panel
- [ ] Download All creates correct ZIP
- [ ] Individual file download works
- [ ] Copy content to clipboard works
- [ ] Context menu appears on right-click
- [ ] Status bar shows total files and size
- [ ] Receives outputs from extraction result
- [ ] Communicates with Editor for file opening
- [ ] No TypeScript errors
```

---

## Coordination Notes

### Shared Types (All agents should use)
Create `src/types/os.ts`:
```typescript
export interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  isFocused: boolean;
  zIndex: number;
}

export interface ExtractionResult {
  url: string;
  siteName: string;
  documents: MarkdownDocument[];
  outputs: GeneratedOutputs;
  stats: {
    totalDocuments: number;
    totalWords: number;
    extractionTime: number;
  };
}

export interface MarkdownDocument {
  title: string;
  url: string;
  content: string;
  wordCount: number;
}
```

### Event Communication
Use a simple event system or React context for cross-component communication:
- Terminal completes → File Manager receives outputs
- Terminal completes → Editor opens main doc
- File Manager double-click → Editor opens file
- Taskbar click → Window focus/minimize

### Page Composition (Agent 1 coordinates)
```typescript
// src/app/extract/page.tsx
export default function ExtractPage() {
  return (
    <WindowManagerProvider>
      <Desktop>
        <TerminalWindow />    {/* Agent 2 */}
        <CodeEditor />        {/* Agent 3 */}
        <FileManager />       {/* Agent 4 */}
        <Taskbar />           {/* Agent 1 */}
      </Desktop>
    </WindowManagerProvider>
  );
}
```

### Quality Bar
Every component must:
1. Be fully typed (no `any`)
2. Handle loading/error states
3. Be responsive (work on smaller screens)
4. Have smooth animations (60fps)
5. Match the dark theme aesthetic
6. Be accessible (keyboard nav, focus states)

---

## Execution Order

```
[Run in Parallel - Phase 1]
├── Agent 1: Desktop Shell (Window, Taskbar, Context)
├── Agent 2: Terminal + Extraction
├── Agent 3: Code Editor
└── Agent 4: File Manager + Downloads

[After All Complete - Phase 2]
└── Integration Testing: Verify all components work together
```

All 4 agents can run simultaneously since they own different files.

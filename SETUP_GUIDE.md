# Symbols AI Platform - Setup Guide

## Quick Start (No External Setup Required)

The chat application now includes everything needed to run. No Python, no external MCP server, no complex setup.

### Prerequisites
- Node.js 18+ (for running the app)
- npm or yarn (for package management)

### Installation

1. **Install dependencies**
   ```bash
   cd chat
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```
   OPENROUTER_API_KEY=your_key_here
   CLAUDE_API_KEY=your_key_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## What's Included

### Embedded MCP Server
- Framework rules and documentation
- Tool definitions for AI agent
- No external process spawning
- No Python required

### File Operations API
- Create, read, update, delete files
- Create and manage directories
- List directory contents
- Full project file management

### AI Chat Interface
- Multiple model support (Claude, OpenRouter)
- Real-time streaming responses
- Project generation and editing
- File visualization

## Architecture

```
┌─────────────────────────────────────┐
│     Next.js Chat Application        │
├─────────────────────────────────────┤
│  Frontend (React)                   │
│  - Chat interface                   │
│  - File browser                     │
│  - Project visualizer               │
├─────────────────────────────────────┤
│  Backend (Node.js)                  │
│  - /api/chat - AI chat endpoint     │
│  - /api/files - File operations     │
│  - Embedded MCP tools               │
├─────────────────────────────────────┤
│  Embedded MCP Server                │
│  - get_project_rules()              │
│  - search_symbols_docs()            │
│  - Agent instructions               │
├─────────────────────────────────────┤
│  File System                        │
│  - output/ - Generated projects     │
│  - public/ - Static assets          │
└─────────────────────────────────────┘
```

## Key Features

### 1. No External Dependencies
- MCP is embedded in the app
- No subprocess spawning
- No Python installation needed
- Single deployment package

### 2. Full File Management
- Create files and folders
- Edit existing files
- Delete files and directories
- List directory contents
- All through REST API

### 3. AI-Powered Generation
- Generate Symbols/DOMQL v3 projects
- Edit existing projects
- Multiple AI models supported
- Real-time streaming responses

### 4. Framework Rules
- Embedded Symbols v3 rules
- AI agent verification
- Documentation search
- Best practices guidance

## API Endpoints

### Chat API
```
POST /api/chat
Content-Type: application/json

{
  "messages": [...],
  "model": "claude-opus-4-6",
  "autoMcp": true,
  "apiKey": "...",
  "apiProvider": "claude"
}
```

### File Operations API
```
GET    /api/files?project=my-app&path=smbls/components
POST   /api/files - Create file/directory
PUT    /api/files - Update file
DELETE /api/files - Delete file/directory
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Railway
1. Push to GitHub
2. Connect repository to Railway
3. Set environment variables:
   - `OPENROUTER_API_KEY`
   - `CLAUDE_API_KEY`
4. Deploy

See `DEPLOYMENT.md` for detailed instructions.

## Configuration

### Environment Variables
- `OPENROUTER_API_KEY` - OpenRouter API key (optional, can set in UI)
- `CLAUDE_API_KEY` - Claude API key (optional, can set in UI)

### Model Selection
- **OpenRouter Models**: Claude Opus 4.6, Sonnet 4.6, Sonnet 4.5, Gemini, GPT, etc.
- **Claude Direct**: Claude Opus 4.6, Sonnet 4.6, Haiku 4.5

Switch between providers in the UI settings.

## Troubleshooting

### App won't start
- Check Node.js version: `node --version` (need 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for port conflicts: port 3000 must be available

### API errors
- Verify API keys are set correctly
- Check browser console for error messages
- Review server logs for detailed errors

### File operations fail
- Ensure `output/` directory exists
- Check file permissions
- Verify project name is valid

### AI responses are incomplete
- Increase `max_tokens` in `openrouter.ts` (currently 32000)
- Check API rate limits
- Verify API key has sufficient quota

## Development

### Project Structure
```
chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts
│   │   │   └── files/route.ts
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   │   ├── embedded-mcp.ts
│   │   ├── mcp-client.ts
│   │   ├── file-client.ts
│   │   ├── openrouter.ts
│   │   └── use-chat.ts
│   └── styles/
├── public/
│   ├── agent-instructions.md
│   └── logo.svg
├── package.json
└── next.config.ts
```

### Adding New MCP Tools
Edit `src/lib/embedded-mcp.ts`:

```typescript
export function getAvailableMcpTools(): McpToolDef[] {
  return [
    // ... existing tools
    {
      name: "my-new-tool",
      description: "What it does",
      inputSchema: { /* ... */ },
    },
  ];
}

export async function callEmbeddedMcpTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  // ... existing tools
  
  if (toolName === "my-new-tool") {
    // Implementation
    return "result";
  }
}
```

## Performance

### Optimization Tips
1. **Streaming responses** - Chat responses stream in real-time
2. **Lazy loading** - Components load on demand
3. **Caching** - API responses cached in browser
4. **File operations** - Async to prevent blocking

### Monitoring
- Check browser DevTools Network tab
- Monitor server logs for API calls
- Track file operation performance

## Security

### File Operations
- Path validation prevents directory traversal
- All paths must be within `output/` directory
- No access to system files

### API Keys
- Can be set via environment variables
- Can be set in UI (stored in localStorage)
- Never logged or exposed in responses

### Rate Limiting
- Implement in production deployment
- Consider API provider rate limits
- Monitor for abuse

## Support

For issues or questions:
1. Check `EMBEDDED_MCP.md` for MCP details
2. Review `DEPLOYMENT.md` for deployment help
3. Check error messages in browser console
4. Review server logs for detailed errors

## Next Steps

1. Install dependencies: `npm install`
2. Set up environment: `cp .env.example .env.local`
3. Add API keys to `.env.local`
4. Start development: `npm run dev`
5. Open http://localhost:3000

Enjoy building with Symbols/DOMQL v3!

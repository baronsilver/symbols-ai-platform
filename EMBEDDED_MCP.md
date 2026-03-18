# Embedded MCP Setup

The chat application now includes an embedded MCP (Model Context Protocol) server. This means **no external setup is required** — everything runs within the Next.js application.

## What Changed

### Before
- MCP was a separate Python package (`symbols-mcp`)
- Chat app spawned `symbols-mcp.exe` as a subprocess
- Users needed to install Python and the MCP package separately
- Deployment required bundling both Node.js and Python

### After
- MCP tools are embedded in the chat app (`src/lib/embedded-mcp.ts`)
- No subprocess spawning needed
- No external dependencies
- Single deployment package

## Architecture

### Embedded MCP Tools

The embedded MCP provides these tools:

1. **get_project_rules** - Returns Symbols/DOMQL v3 framework rules
2. **search_symbols_docs** - Search documentation (simple keyword matching)

These tools are called by the AI agent to verify patterns and best practices.

### File Structure

```
chat/
├── src/
│   ├── lib/
│   │   ├── embedded-mcp.ts        # Embedded MCP implementation
│   │   ├── mcp-client.ts          # MCP client (now uses embedded)
│   │   ├── file-client.ts         # Client-side file operations
│   │   └── file-operations.ts     # Server-side file operations
│   ├── app/
│   │   └── api/
│   │       ├── chat/route.ts      # Chat API (unchanged)
│   │       └── files/route.ts     # File operations API
│   └── ...
├── public/
│   └── agent-instructions.md      # Embedded agent instructions
└── ...
```

## File Operations API

The app now supports full file system operations through `/api/files`:

### GET - Read file or list directory
```bash
GET /api/files?project=my-app&path=smbls/components/Navbar.js
```

Response (file):
```json
{ "type": "file", "content": "..." }
```

Response (directory):
```json
{ "type": "directory", "items": [...] }
```

### POST - Create file or directory
```bash
POST /api/files
Content-Type: application/json

{
  "projectName": "my-app",
  "path": "smbls/components/NewComponent.js",
  "content": "export const NewComponent = { ... }",
  "isDirectory": false
}
```

### PUT - Update file
```bash
PUT /api/files
Content-Type: application/json

{
  "projectName": "my-app",
  "path": "smbls/components/Navbar.js",
  "content": "export const Navbar = { ... }"
}
```

### DELETE - Delete file or directory
```bash
DELETE /api/files
Content-Type: application/json

{
  "projectName": "my-app",
  "path": "smbls/components/OldComponent.js"
}
```

## Client-Side Usage

Use the `file-client.ts` utilities in React components:

```typescript
import {
  readFile,
  listDirectory,
  createFile,
  updateFile,
  deleteFile,
} from "@/lib/file-client";

// Read a file
const content = await readFile("my-app", "smbls/components/Navbar.js");

// List directory
const files = await listDirectory("my-app", "smbls/components");

// Create a file
await createFile("my-app", "smbls/components/NewComponent.js", "export const NewComponent = { ... }");

// Update a file
await updateFile("my-app", "smbls/components/Navbar.js", "export const Navbar = { ... }");

// Delete a file
await deleteFile("my-app", "smbls/components/OldComponent.js");
```

## Deployment

Since MCP is now embedded:

1. **No Python required** - Only Node.js
2. **No subprocess spawning** - Simpler process management
3. **Single package** - Deploy just the Next.js app
4. **Faster startup** - No need to spawn external processes

### Railway Deployment

The existing `railway.json` configuration works as-is. No changes needed.

### Docker Deployment

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

## Limitations

The embedded MCP has simplified implementations:

1. **search_symbols_docs** - Uses simple keyword matching instead of semantic search
2. **Documentation** - Loads from `public/agent-instructions.md` instead of full docs

For production, consider:
- Implementing full semantic search
- Loading more comprehensive documentation
- Caching search results

## Migration Notes

If you have existing code that uses the external MCP:

1. The `callMcpTool()` function works the same way
2. The `listMcpTools()` function returns the same tool definitions
3. No changes needed in chat API code

The migration is transparent to the rest of the application.

## Future Enhancements

Possible improvements:

1. Add more MCP tools (e.g., file analysis, code generation helpers)
2. Implement semantic search for documentation
3. Add caching layer for tool results
4. Support for custom MCP tools via plugins

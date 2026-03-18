# Local File System Support

The chat app now supports saving generated projects directly to your local computer instead of just the web server. This gives you full control over where your projects are stored.

## Features

### Dual Storage Options
- **Local Storage** - Save projects directly to your computer (recommended)
- **Web Storage** - Save projects on the web server (default)

### Automatic Fallback
- If local file system access is not available, automatically uses web storage
- Seamless switching between storage modes

### Persistent Folder Selection
- Selected folder is saved in browser's IndexedDB
- Automatically reconnects to your folder on next visit
- No need to re-select folder each time

## Browser Support

### Supported Browsers
- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Opera 72+
- ✅ Brave (with flag enabled)

### Not Supported
- ❌ Firefox (as of March 2026)
- ❌ Safari (as of March 2026)
- ❌ Internet Explorer

For unsupported browsers, the app automatically falls back to web storage.

## How to Use

### 1. Select Local Folder

In the chat interface, you'll see a "Select Local Folder" button:

1. Click the button
2. A folder picker dialog opens
3. Choose where you want to save projects
4. Grant permission (browser will ask)
5. Done! Your folder is now connected

### 2. Generate Projects

When you generate a project:
- Files are created in your selected local folder
- You can open them directly in your file explorer
- Edit them with your favorite editor
- Full control over file organization

### 3. Change Folder

To switch to a different folder:
1. Click the "Change" button next to the folder name
2. Select a new folder
3. New projects will be saved there

## File Organization

Projects are organized like this:

```
Your Selected Folder/
├── project-name/
│   ├── smbls/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── designSystem/
│   │   ├── state.js
│   │   └── index.js
│   ├── package.json
│   ├── index.html
│   └── index.js
```

## API Usage

### Using Unified File System

The app provides a unified API that works with both local and web storage:

```typescript
import {
  readFile,
  writeFile,
  createFile,
  createDirectory,
  listDirectory,
  deleteFile,
} from "@/lib/unified-file-system";

const fs = {
  type: "local" as const,
  projectName: "my-app",
  localHandle: folderHandle, // From folder selection
};

// Read a file
const content = await readFile(fs, "smbls/components/Navbar.js");

// Write a file
await writeFile(fs, "smbls/components/Navbar.js", "export const Navbar = { ... }");

// Create a file
await createFile(fs, "smbls/components/NewComponent.js", "export const NewComponent = { ... }");

// Create a directory
await createDirectory(fs, "smbls/utils");

// List directory
const files = await listDirectory(fs, "smbls/components");

// Delete a file
await deleteFile(fs, "smbls/components/OldComponent.js");
```

### Direct Local File System API

For advanced use cases, use the local file system API directly:

```typescript
import {
  readLocalFile,
  writeLocalFile,
  createLocalDirectory,
  listLocalDirectory,
  deleteLocalFile,
  saveFolderHandle,
  getFolderHandle,
} from "@/lib/local-file-system";

// Get saved folder handle
const handle = await getFolderHandle("my-app");

if (handle) {
  // Read file
  const content = await readLocalFile(handle, "smbls/components/Navbar.js");

  // Write file
  await writeLocalFile(handle, "smbls/components/Navbar.js", "...");

  // List directory
  const files = await listLocalDirectory(handle, "smbls/components");
}
```

## Security & Permissions

### Browser Permissions
- User must explicitly grant permission to a folder
- App can only access the selected folder and its contents
- User can revoke access at any time through browser settings

### File Access
- App has read/write access to selected folder
- Cannot access other folders on the computer
- Cannot access system files

### Data Storage
- Folder handle is stored in browser's IndexedDB
- Handles are encrypted by the browser
- User can clear this data anytime

## Troubleshooting

### "File System Access not supported"
- Your browser doesn't support the API
- Use Chrome, Edge, or Opera
- Or use web storage instead

### "Permission denied" error
- Browser permission was denied
- Click "Change" to select folder again
- Grant permission when prompted

### Files not appearing in folder
- Check that you selected the correct folder
- Verify folder permissions
- Try refreshing the page

### Lost folder connection
- Browser data was cleared
- Select the folder again
- The app will remember it next time

## Comparison: Local vs Web Storage

| Feature | Local | Web |
|---------|-------|-----|
| File Location | Your Computer | Web Server |
| Browser Support | Chrome, Edge, Opera | All Browsers |
| Permission Required | Yes (one-time) | No |
| File Access | Direct | Via API |
| Offline Access | Yes | No |
| Persistence | Permanent | Server-dependent |
| Speed | Faster | Slower |
| Backup | Your responsibility | Server backup |

## Best Practices

### 1. Use Local Storage for Development
- Faster file access
- Direct file editing
- Better version control integration

### 2. Use Web Storage for Sharing
- Share projects via URL
- Collaborate with others
- No local setup needed

### 3. Regular Backups
- Local storage: Use Git or cloud backup
- Web storage: Server handles backups

### 4. Organize Projects
- Create separate folders for different projects
- Use meaningful folder names
- Keep folder structure clean

## Advanced: Electron/Tauri Desktop App

For a full desktop experience, consider wrapping the app with:

### Electron
```bash
npm install electron
```

Provides:
- Full file system access
- Native file dialogs
- System integration
- Offline capability

### Tauri
```bash
npm install tauri
```

Provides:
- Lightweight alternative to Electron
- Smaller bundle size
- Better performance
- Rust backend

## Future Enhancements

Planned improvements:
1. Drag-and-drop folder selection
2. Recent folders list
3. Folder favorites
4. Sync between local and web storage
5. Cloud storage integration (Google Drive, OneDrive)
6. Git integration for auto-commit

## Support

For issues with local file system:
1. Check browser compatibility
2. Verify folder permissions
3. Try selecting folder again
4. Check browser console for errors
5. Use web storage as fallback

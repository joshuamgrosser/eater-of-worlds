# eater-of-worlds

Ingests Obsidian markdown vaults into Foundry VTT journal pages.

## Local Development Setup

This guide will help you set up local development with a local Foundry VTT server running on the same machine.

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager
- Foundry VTT installed locally
- A Foundry VTT world/game ready for testing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/joshuamgrosser/eater-of-worlds.git
   cd eater-of-worlds
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Workflow

#### Initial Setup

1. **Start the development environment:**
   ```bash
   npm run dev
   ```

   This command will:
   - Build the TypeScript code
   - Create a symbolic link from Foundry VTT's modules directory to your project's `dist/` folder
   - Start file watchers that automatically rebuild when you make changes

2. **Enable the module in Foundry VTT:**
   - Launch Foundry VTT
   - Open your world/game
   - Go to **Settings** → **Manage Modules**
   - Find **Eater of Worlds** in the list
   - Check the box to enable it
   - Click **Save Module Settings**

#### Making Changes

1. **Edit your code** in the `src/` directory:
   - TypeScript files: `src/*.ts`
   - Module manifest: `src/module.json`
   - Other files: `README.md`, `LICENSE` (if needed)

2. **Files are automatically rebuilt:**
   - TypeScript files are compiled to `dist/scripts/` on save
   - Static files (`module.json`, `README.md`, `LICENSE`) are copied to `dist/` on save

3. **Refresh Foundry VTT:**
   - Press `F5` or refresh your browser to reload the module
   - Your changes will be immediately available

#### Development Scripts

- `npm run dev` - Start full development workflow (build → link → watch)
- `npm run build` - Build the project once (no watching)
- `npm run build:watch` - Watch for file changes and rebuild automatically
- `npm run dev:link` - Create/update the symlink to Foundry VTT modules directory
- `npm run dev:unlink` - Remove the symlink (useful for cleanup)

#### How the Symlink Works

The development setup uses a **symbolic link** (symlink) to connect Foundry VTT's modules directory directly to your project's `dist/` folder. This means:

- **No manual copying needed** - Foundry reads directly from your `dist/` folder
- **Instant updates** - Changes are immediately available after refresh
- **Single source of truth** - Your `dist/` folder is the only place files exist

The symlink location depends on your operating system:

- **macOS**: `~/Library/Application Support/FoundryVTT/Data/modules/eater-of-worlds`
- **Windows**: `%LOCALAPPDATA%\FoundryVTT\Data\modules\eater-of-worlds`
- **Linux**: `~/.local/share/FoundryVTT/Data/modules/eater-of-worlds`

#### Testing Your Module

1. **Open the browser console** in Foundry VTT (F12)
2. **Look for module logs:**
   ```
   Hello World! This code runs immediately when the file is loaded.
   Eater of Worlds | This code runs once the Foundry VTT software begins its initialization workflow.
   Eater of Worlds | This code runs once core initialization is ready and game data is available.
   ```
3. **Test your module's functionality** in the Foundry VTT interface

#### Troubleshooting

**Module doesn't appear in Foundry VTT:**
- Ensure the symlink was created successfully: `npm run dev:link`
- Check that Foundry VTT is looking in the correct modules directory
- Verify the module is enabled in your world's module settings

**Changes not appearing after refresh:**
- Check that the build process is running (you should see file change messages in the terminal)
- Verify the symlink still exists: `npm run dev:link`
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Symlink errors on Windows:**
- You may need to run PowerShell as Administrator to create symlinks
- Alternatively, manually create the symlink using: `New-Item -ItemType SymbolicLink -Target "path\to\dist" -Path "path\to\modules\eater-of-worlds"`

**Broken symlink:**
- If you moved or deleted the project, the symlink may be broken
- Run `npm run dev:unlink` to remove it, then `npm run dev:link` to recreate it

#### Cleanup

When you're done developing or need to clean up:

1. **Stop the watch processes:** Press `Ctrl+C` in the terminal running `npm run dev`

2. **Remove the symlink** (optional, but recommended):
   ```bash
   npm run dev:unlink
   ```

3. **Clean build artifacts** (if needed):
   ```bash
   rm -rf dist
   ```

### Project Structure

```
eater-of-worlds/
├── src/              # Source TypeScript files
│   ├── index.ts      # Main module entry point
│   └── module.json   # Module manifest
├── dist/             # Compiled output (generated)
│   ├── scripts/      # Compiled JavaScript
│   ├── module.json   # Module manifest (copied)
│   └── ...
├── utils/            # Build and development utilities
│   ├── build.mjs     # Build script with watch mode
│   ├── link.mjs      # Symlink creation script
│   └── unlink.mjs    # Symlink removal script
└── package.json      # npm configuration and scripts
```

### Building for Release

To create a release build:

```bash
npm run build
```

This creates a production-ready `dist/` folder that can be packaged and distributed.

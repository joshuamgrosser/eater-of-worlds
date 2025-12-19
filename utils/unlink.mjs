import { unlink, existsSync, lstatSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { homedir } from 'os';

const unlinkAsync = promisify(unlink);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Foundry VTT modules directory paths by OS
const homeDir = homedir();
const foundryPaths = {
  darwin: join(homeDir, 'Library/Application Support/FoundryVTT/Data/modules'),
  win32: join(process.env.LOCALAPPDATA || join(process.env.USERPROFILE || homeDir, 'AppData/Local'), 'FoundryVTT/Data/modules'),
  linux: join(homeDir, '.local/share/FoundryVTT/Data/modules')
};

const platform = process.platform;
const modulesDir = foundryPaths[platform];

if (!modulesDir) {
  console.error(`Unsupported platform: ${platform}`);
  process.exit(1);
}

const moduleName = 'eater-of-worlds';
const symlinkPath = join(modulesDir, moduleName);

async function removeSymlink() {
  if (existsSync(symlinkPath)) {
    try {
      const stats = lstatSync(symlinkPath);
      if (stats.isSymbolicLink()) {
        await unlinkAsync(symlinkPath);
        console.log(`✓ Removed symlink: ${symlinkPath}`);
      } else {
        console.log(`Warning: ${symlinkPath} exists but is not a symlink`);
        console.log('Skipping removal - please remove manually if needed');
      }
    } catch (e) {
      console.error(`Error removing symlink: ${e.message}`);
      process.exit(1);
    }
  } else {
    console.log('Symlink does not exist');
  }
}

removeSymlink();


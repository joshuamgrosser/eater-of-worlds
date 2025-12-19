import { symlink, unlink, existsSync, readlinkSync, lstatSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { promisify } from 'util';
import { homedir } from 'os';

const symlinkAsync = promisify(symlink);
const unlinkAsync = promisify(unlink);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = resolve(rootDir, 'dist');

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

async function createSymlink() {
  // Ensure dist directory exists
  if (!existsSync(distDir)) {
    console.error(`Error: ${distDir} does not exist. Run 'npm run build' first.`);
    process.exit(1);
  }

  // Ensure modules directory exists
  try {
    if (platform === 'win32') {
      execSync(`if not exist "${modulesDir}" mkdir "${modulesDir}"`, { stdio: 'ignore' });
    } else {
      execSync(`mkdir -p "${modulesDir}"`, { stdio: 'ignore' });
    }
  } catch (e) {
    console.error(`Error: Could not create modules directory: ${modulesDir}`);
    console.error('Please ensure Foundry VTT is installed.');
    process.exit(1);
  }

  // Check if symlink already exists
  if (existsSync(symlinkPath)) {
    try {
      const stats = lstatSync(symlinkPath);
      if (stats.isSymbolicLink()) {
        const currentTarget = readlinkSync(symlinkPath);
        const resolvedTarget = resolve(modulesDir, currentTarget);
        const resolvedDist = resolve(distDir);
        
        if (resolvedTarget === resolvedDist) {
          console.log(`✓ Symlink already exists and points to correct location`);
          return;
        } else {
          console.log(`Removing existing symlink pointing to ${currentTarget}`);
          await unlinkAsync(symlinkPath);
        }
      } else {
        console.error(`Error: ${symlinkPath} exists but is not a symlink.`);
        console.error('Please remove it manually and try again.');
        process.exit(1);
      }
    } catch (e) {
      console.error(`Error checking existing symlink: ${e.message}`);
      process.exit(1);
    }
  }

  // Create symlink
  try {
    await symlinkAsync(distDir, symlinkPath, 'dir');
    console.log(`✓ Created symlink: ${symlinkPath} -> ${distDir}`);
    console.log(`\nYour module is now linked! Refresh Foundry VTT to see changes.`);
  } catch (e) {
    console.error(`Error creating symlink: ${e.message}`);
    if (platform === 'win32' && e.code === 'EPERM') {
      console.error('\nOn Windows, you may need to run PowerShell as Administrator.');
    }
    process.exit(1);
  }
}

createSymlink();


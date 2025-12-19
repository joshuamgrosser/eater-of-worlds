import { copyFileSync, mkdirSync, existsSync, watch } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

const watchMode = process.argv.includes('--watch');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Files to copy to dist
const filesToCopy = [
  { src: 'src/module.json', dest: 'dist/module.json' },
  { src: 'README.md', dest: 'dist/README.md' },
  { src: 'LICENSE', dest: 'dist/LICENSE' }
];

// Function to copy files
function copyFiles() {
  filesToCopy.forEach(({ src, dest }) => {
    const srcPath = join(rootDir, src);
    const destPath = join(rootDir, dest);
    
    if (existsSync(srcPath)) {
      // Ensure destination directory exists
      const destDirPath = dirname(destPath);
      if (!existsSync(destDirPath)) {
        mkdirSync(destDirPath, { recursive: true });
      }
      
      copyFileSync(srcPath, destPath);
      if (!watchMode) {
        console.log(`Copied ${src} -> ${dest}`);
      }
    } else {
      console.warn(`Warning: ${src} not found, skipping`);
    }
  });
}

// Create empty directories that might be needed
function createDirectories() {
  const dirsToCreate = [
    'dist/templates',
    'dist/styles',
    'dist/packs',
    'dist/lang'
  ];

  dirsToCreate.forEach(dir => {
    const dirPath = join(rootDir, dir);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  });
}

// Initial copy and directory creation
copyFiles();
createDirectories();

if (watchMode) {
  console.log('Watching for changes to module.json, README.md, and LICENSE...');
  
  // Watch each file
  filesToCopy.forEach(({ src }) => {
    const srcPath = join(rootDir, src);
    if (existsSync(srcPath)) {
      watch(srcPath, (eventType) => {
        if (eventType === 'change') {
          console.log(`[build] File changed: ${src}`);
          copyFiles();
        }
      });
    }
  });
} else {
  console.log('Build completed successfully');
}


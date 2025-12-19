import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

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

// Copy files
filesToCopy.forEach(({ src, dest }) => {
  const srcPath = join(rootDir, src);
  const destPath = join(rootDir, dest);
  
  if (existsSync(srcPath)) {
    // Ensure destination directory exists
    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.warn(`Warning: ${src} not found, skipping`);
  }
});

// Create empty directories that might be needed
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

console.log('Build completed successfully');


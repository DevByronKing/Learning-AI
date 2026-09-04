const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Fix double dark:bg caused by our previous script:
  // e.g. "bg-white dark:bg-dark-card hover:bg-slate-50 dark:bg-dark-hover"
  // The duplicate dark:bg-dark-hover after hover should be "dark:hover:bg-dark-hover"
  
  // Pattern: "hover:bg-slate-50 dark:bg-dark-hover" → "hover:bg-slate-50 dark:hover:bg-dark-hover"
  // But only when it's part of a chain like "bg-X dark:bg-Y hover:bg-Z dark:bg-dark-hover"
  content = content.replace(/hover:bg-slate-50 dark:bg-dark-hover/g, 'hover:bg-slate-50 dark:hover:bg-dark-hover');
  content = content.replace(/hover:bg-slate-200 dark:bg-dark-hover/g, 'hover:bg-slate-200 dark:hover:bg-dark-hover');
  content = content.replace(/dark:hover:bg-slate-50 dark:bg-dark-hover/g, 'dark:hover:bg-dark-hover');
  
  // Also fix cases where we have duplicated dark: bg for the same element (not hover)
  // e.g. "dark:bg-dark-surface dark:bg-dark-hover" - remove the first one that's superseded
  content = content.replace(/dark:bg-dark-surface\/80 dark:bg-dark-hover/g, 'dark:hover:bg-dark-hover');
  content = content.replace(/dark:bg-dark-card dark:hover:bg-slate-50 dark:bg-dark-hover/g, 'dark:bg-dark-card dark:hover:bg-dark-hover');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed ${path.basename(filePath)}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  });
}

walkDir(srcDir);
console.log('Done cleaning up duplicate dark: classes.');

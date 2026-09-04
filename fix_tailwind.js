const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'components');

const replaceRules = [
  // Backgrounds
  { regex: /(?<!dark:)(?<!light:)bg-slate-800/g, replacement: 'bg-slate-100 dark:bg-slate-800' },
  { regex: /(?<!dark:)(?<!light:)bg-slate-900/g, replacement: 'bg-white dark:bg-slate-900' },
  { regex: /(?<!dark:)(?<!light:)bg-\[\#0f172a\]/gi, replacement: 'bg-white dark:bg-[#0f172a]' },
  { regex: /(?<!dark:)(?<!light:)bg-\[\#11182c\]/gi, replacement: 'bg-white dark:bg-[#11182c]' },
  { regex: /(?<!dark:)(?<!light:)bg-\[\#080C14\]/gi, replacement: 'bg-slate-50 dark:bg-[#080C14]' },
  { regex: /(?<!dark:)(?<!light:)bg-\[\#131E35\]/gi, replacement: 'bg-white dark:bg-[#131E35]' },
  { regex: /(?<!dark:)(?<!light:)bg-dark-surface/g, replacement: 'bg-white dark:bg-dark-surface' },
  { regex: /(?<!dark:)(?<!light:)bg-dark-card/g, replacement: 'bg-white dark:bg-dark-card' },
  { regex: /(?<!dark:)(?<!light:)bg-dark-hover/g, replacement: 'bg-slate-50 dark:bg-dark-hover' },
  
  // Text colors
  { regex: /(?<!dark:)(?<!light:)text-slate-400/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /(?<!dark:)(?<!light:)text-slate-300/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { regex: /(?<!dark:)(?<!light:)text-slate-200/g, replacement: 'text-slate-700 dark:text-slate-200' },
  { regex: /(?<!dark:)(?<!light:)text-slate-100/g, replacement: 'text-slate-800 dark:text-slate-100' },
  
  // Borders
  { regex: /(?<!dark:)(?<!light:)border-slate-700/g, replacement: 'border-slate-200 dark:border-slate-700' },
  { regex: /(?<!dark:)(?<!light:)border-slate-800/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { regex: /(?<!dark:)(?<!light:)border-white\/5/g, replacement: 'border-slate-200 dark:border-white/5' },
  { regex: /(?<!dark:)(?<!light:)border-white\/10/g, replacement: 'border-slate-300 dark:border-white/10' },

  // Special cases for text-white that are not inside specific buttons
  // This is too complex for simple regex without risking breaking blue buttons.
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Apply general replacements
  replaceRules.forEach(rule => {
    content = content.replace(rule.regex, rule.replacement);
  });

  // Handle text-white carefully:
  // If the line contains bg-indigo, bg-purple, bg-rose, bg-emerald, bg-blue, bg-amber, from-, we assume text-white is intended for both modes.
  // Otherwise, we replace text-white with text-slate-900 dark:text-white
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('text-white') || line.includes('hover:text-white')) {
      const isColoredBg = /(bg-indigo|bg-purple|bg-rose|bg-emerald|bg-blue|bg-amber|from-indigo|from-purple|from-rose|from-emerald|from-blue|from-amber|bg-rose-500|bg-emerald-500)/.test(line);
      if (!isColoredBg) {
        let newLine = line.replace(/(?<!dark:)(?<!light:)text-white/g, 'text-slate-900 dark:text-white');
        newLine = newLine.replace(/(?<!dark:)(?<!light:)hover:text-white/g, 'hover:text-slate-900 dark:hover:text-white');
        return newLine;
      }
    }
    return line;
  });
  
  content = newLines.join('\n');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${path.basename(filePath)}`);
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
console.log('Finished updating tailwind classes.');

const fs = require('fs');
const path = './src/components/afe/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Main wrapper
content = content.replace('bg-gray-50 text-gray-800 antialiased', 'text-slate-800 dark:text-slate-200 antialiased');

// 2. Main structural backgrounds
content = content.replace(/bg-slate-800\/50(?!\/)/g, 'bg-white dark:bg-slate-800/50');
content = content.replace(/bg-gray-50/g, 'bg-slate-50 dark:bg-slate-900/50');

// 3. Text colors
content = content.replace(/text-slate-300/g, 'text-slate-600 dark:text-slate-300');
content = content.replace(/text-gray-300/g, 'text-slate-600 dark:text-gray-300');
content = content.replace(/text-gray-800/g, 'text-slate-900 dark:text-gray-100');

// 4. Borders
content = content.replace(/border-gray-100/g, 'border-slate-200 dark:border-slate-700/50');
content = content.replace(/border-slate-700/g, 'border-slate-200 dark:border-slate-700');

// 5. Some specific cards / icons
content = content.replace(/bg-slate-800\/50\/30/g, 'bg-slate-200 dark:bg-slate-800/50');
content = content.replace(/bg-slate-800\/50\/20/g, 'bg-slate-100 dark:bg-slate-800/40');
content = content.replace(/bg-slate-800\/50\/10/g, 'bg-slate-50 dark:bg-slate-800/20');
content = content.replace(/border-white\/20/g, 'border-slate-200 dark:border-white/20');

// 6. Navigation bar
content = content.replace(/bg-slate-800\/50\/95/g, 'bg-white/95 dark:bg-slate-800/90');
content = content.replace(/text-slate-200/g, 'text-slate-600 dark:text-slate-200');

fs.writeFileSync(path, content, 'utf8');
console.log('App.tsx patched successfully!');

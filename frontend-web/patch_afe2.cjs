const fs = require('fs');
const path = './src/components/afe/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix text-white inside the list items for "Le Prêt" card which has bg-white dark:bg-slate-800/50
content = content.replace(/className="text-white">0% d'intérêt/g, 'className="text-slate-900 dark:text-white">0% d\'intérêt');
content = content.replace(/className="text-white">Garanti par/g, 'className="text-slate-900 dark:text-white">Garanti par');
content = content.replace(/className="text-white">Remboursement/g, 'className="text-slate-900 dark:text-white">Remboursement');

// Fix text-brand-dark headings to adapt to dark mode (except where on yellow cards)
// Be careful with the Bourse card which has a gradient background (yellow), so text-brand-dark is good there.
// But for standard h2 and h3...
content = content.replace(/text-brand-dark/g, 'text-slate-900 dark:text-white');
// Restore text-brand-dark on the Bourse card and yellow buttons specifically if they got changed:
content = content.replace(/bg-brand-yellow text-slate-900 dark:text-white/g, 'bg-brand-yellow text-brand-dark');
content = content.replace(/from-brand-yellow to-yellow-500 text-slate-900 dark:text-white/g, 'from-brand-yellow to-yellow-500 text-brand-dark');
content = content.replace(/text-slate-900 dark:text-white mb-4">La Bourse/g, 'text-brand-dark mb-4">La Bourse');

// Also, text-gray-800 was used on grey cards, let's make sure it's dark text on light mode and white on dark
content = content.replace(/text-gray-800/g, 'text-slate-900 dark:text-white');

fs.writeFileSync(path, content, 'utf8');
console.log('App.tsx patched part 2 successfully!');

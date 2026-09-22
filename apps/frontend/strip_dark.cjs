const fs = require('fs');
let code = fs.readFileSync('src/components/CalculateurDiplome.tsx', 'utf8');
code = code.replace(/dark:[a-zA-Z0-9\-/[\]#.]+/g, '');
// Clean up multiple spaces that might have been left behind inside quotes or class strings
code = code.replace(/  +/g, ' ');
fs.writeFileSync('src/components/CalculateurDiplome.tsx', code);

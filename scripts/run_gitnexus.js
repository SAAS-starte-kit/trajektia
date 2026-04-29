// Exécute gitnexus analyze en utilisant EXPLICITEMENT Node 18.20.8
// Contournement du PATH NVM Windows qui reste sur Node 20
const { spawnSync } = require('child_process');
const path = require('path');
const os = require('os');

const NVM_ROOT = path.join(os.homedir(), 'AppData', 'Roaming', 'nvm');
const NODE18 = path.join(NVM_ROOT, 'v18.20.8', 'node.exe');
const GN18 = path.join(NVM_ROOT, 'v18.20.8', 'node_modules', 'gitnexus', 'dist', 'cli', 'index.js');
const REPO = 'C:\\Users\\Patrice.DESKTOP-I932PON\\Dev\\saas-ai-starter\\trajektia';

console.log('Node 18 binary:', NODE18);
console.log('GitNexus script:', GN18);
console.log('Repo:', REPO);
console.log('');

const fs = require('fs');
if (!fs.existsSync(NODE18)) {
  console.error('❌ Node 18 non trouvé à:', NODE18);
  process.exit(1);
}
if (!fs.existsSync(GN18)) {
  console.error('❌ GitNexus pour Node 18 non trouvé à:', GN18);
  console.log('   Installer avec : nvm use 18 && npm install -g gitnexus');
  process.exit(1);
}

console.log('▶ Lancement: node18 gitnexus analyze', REPO, '--skills');
console.log('');

const result = spawnSync(NODE18, [GN18, 'analyze', REPO, '--skills'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: path.join(NVM_ROOT, 'v18.20.8') + ';' + process.env.PATH
  }
});

console.log('\nExit code:', result.status);
if (result.error) {
  console.error('Erreur spawn:', result.error.message);
}

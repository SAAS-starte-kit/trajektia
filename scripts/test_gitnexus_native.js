try {
  const bs = require('better-sqlite3');
  console.log('better-sqlite3 OK, version:', bs.version || 'n/a');
  const db = bs(':memory:');
  db.exec('CREATE TABLE t (id INTEGER)');
  console.log('SQLite in-memory: OK');
  db.close();
} catch(e) {
  console.error('ERREUR better-sqlite3:', e.code, e.message);
}

try {
  const ts = require('tree-sitter');
  console.log('tree-sitter OK');
} catch(e) {
  console.error('ERREUR tree-sitter:', e.message);
}

console.log('Node version:', process.version);
console.log('Platform:', process.platform, process.arch);

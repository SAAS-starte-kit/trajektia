import { optimizeDeps, resolveConfig } from 'vite';
const config = await resolveConfig({}, 'serve', 'development', 'development');
console.log('Mode:', config.mode);

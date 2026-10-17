import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================');
console.log('🇮🇳 JANSAHAY AI — FULLSTACK INITIALIZATION');
console.log('Discover. Understand. Prepare. Apply.');
console.log('================================================================');

// 1. Spawn Backend Server
const serverDir = path.join(__dirname, 'server');
const serverProcess = spawn('node', ['src/server.js'], {
  cwd: serverDir,
  shell: true,
  stdio: 'inherit'
});

// 2. Spawn Frontend Client
const clientDir = path.join(__dirname, 'client');
const clientProcess = spawn('npx', ['vite', '--host'], {
  cwd: clientDir,
  shell: true,
  stdio: 'inherit'
});

process.on('SIGINT', () => {
  console.log('\n[JanSahay] Shutting down services gracefully...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
});

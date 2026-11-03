import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================');
console.log('🇮🇳 JANSAHAY AI — FULLSTACK INITIALIZATION');
console.log('Java 17 Spring Boot Backend + React 18 Vite Frontend');
console.log('================================================================');

// 1. Spawn Java Spring Boot Backend Server
const serverDir = path.join(__dirname, 'server');
const isWindows = process.platform === 'win32';
const mvnCmd = isWindows ? 'mvn.cmd' : 'mvn';

const serverProcess = spawn(mvnCmd, ['spring-boot:run'], {
  cwd: serverDir,
  shell: true,
  stdio: 'inherit'
});

// 2. Spawn React Client
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

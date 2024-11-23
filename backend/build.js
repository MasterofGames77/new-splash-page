const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log the current directory contents
console.log('Current directory contents:');
console.log(fs.readdirSync('.'));

// Log if server.ts exists
console.log('server.ts exists:', fs.existsSync('./server.ts'));

// Log if routes directory exists and its contents
if (fs.existsSync('./routes')) {
  console.log('routes directory contents:');
  console.log(fs.readdirSync('./routes'));
}

// Run TypeScript compiler
try {
  execSync('npx tsc', { stdio: 'inherit' });
} catch (error) {
  console.error('TypeScript compilation failed:', error);
  process.exit(1);
} 
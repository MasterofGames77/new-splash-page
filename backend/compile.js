const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Log the current working directory
console.log('Current working directory:', process.cwd());

// List all files in the current directory
console.log('Files in current directory:');
fs.readdirSync('.').forEach(file => {
    console.log(file);
});

// Check for specific TypeScript files
const requiredFiles = [
    './server.ts',
    './routes/auth.ts',
    './routes/getWaitlistPosition.ts',
    './routes/approveUser.ts'
];

requiredFiles.forEach(file => {
    console.log(`Checking for ${file}: ${fs.existsSync(file)}`);
});

// Run TypeScript compiler
exec('npx tsc', (error, stdout, stderr) => {
    if (error) {
        console.error(`TypeScript compilation error: ${error}`);
        console.error(`stderr: ${stderr}`);
        process.exit(1);
    }
    console.log(`stdout: ${stdout}`);
}); 
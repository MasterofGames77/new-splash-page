const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create source files
const files = {
  'server.ts': `
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/auth';
import getWaitlistPositionRoute from './routes/getWaitlistPosition';
import approveUserRoute from './routes/approveUser';

// ... rest of your server.ts content ...
`,
  'routes/auth.ts': `
// Your auth.ts content
`,
  'routes/getWaitlistPosition.ts': `
// Your getWaitlistPosition.ts content
`,
  'routes/approveUser.ts': `
// Your approveUser.ts content
`
};

// Ensure directories exist
if (!fs.existsSync('routes')) {
  fs.mkdirSync('routes');
}

// Write files
Object.entries(files).forEach(([filename, content]) => {
  fs.writeFileSync(filename, content);
  console.log(`Created ${filename}`);
});

// Run TypeScript compiler
try {
  console.log('Running TypeScript compiler...');
  execSync('npx tsc', { stdio: 'inherit' });
} catch (error) {
  console.error('TypeScript compilation failed:', error);
  process.exit(1);
} 
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

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err: any) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', getWaitlistPositionRoute);
app.use('/api', approveUserRoute);

// Serve static files
const frontendPath = path.join(__dirname, '../../frontend/out');
app.use(express.static(frontendPath));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`,
  'routes/auth.ts': `
import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  // Your signup logic here
});

router.post('/login', async (req: Request, res: Response) => {
  // Your login logic here
});

export default router;
`,
  'routes/getWaitlistPosition.ts': `
import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/getWaitlistPosition', async (req: Request, res: Response) => {
  // Your getWaitlistPosition logic here
});

export default router;
`,
  'routes/approveUser.ts': `
import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/approveUser', async (req: Request, res: Response) => {
  // Your approveUser logic here
});

export default router;
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
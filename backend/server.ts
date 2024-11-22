import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Import Routes
import authRoutes from './routes/auth';
import waitlistRoutes from './routes/waitlist';
import getWaitlistPositionRoute from './routes/getWaitlistPosition';
import approveUserRoute from './routes/approveUser';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS Setup
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const whitelist = [
      'http://localhost:3000', // For local development
      'https://unified-vgw-splash-page-ce047efdcf15.herokuapp.com' // Production link
    ];
    if (!origin || whitelist.includes(origin)) {
      console.log(`CORS request from origin: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`CORS request blocked from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// MongoDB Connection to Splash Page MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB (Splash Page) connected successfully'))
  .catch((err: any) => {
    console.error('MongoDB connection error (Splash Page):', err);
    process.exit(1); // Exit if connection fails
  });

// Routes Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', waitlistRoutes);
app.use('/api', getWaitlistPositionRoute);
app.use('/api', approveUserRoute);

// Update these path configurations
const frontendPath = path.join(__dirname, '../../frontend/out');

// Serve Static Files from the Frontend Build Directory
app.use(express.static(frontendPath));

// Catch-All Route to Serve the Frontend `index.html`
app.get('*', (req: express.Request, res: express.Response): void => {
  const indexPath = path.join(frontendPath, 'index.html');
  
  console.log('Attempting to serve frontend from:', indexPath);
  
  try {
    if (!fs.existsSync(indexPath)) {
      console.error('index.html not found at:', indexPath);
      res.status(404).json({ message: 'Frontend build files not found' });
      return;
    }
    
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error serving frontend files' });
      }
    });
  } catch (error) {
    console.error('Error in catch-all route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Global Error-Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Global error handler:`, err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start the Server
app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${port}`);
});
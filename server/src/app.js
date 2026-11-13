import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import healthRoutes from './routes/healthRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Allow only configured frontend origins.
const allowedOrigins = new Set([
  config.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origin not allowed by CORS');
    error.status = 403;
    return callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CARECONNECT Healthcare Management API',
    tagline: 'Connecting Care. Saving Lives.',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health',
      ping: '/api/ping'
    }
  });
});

// API routes
app.use('/api', healthRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

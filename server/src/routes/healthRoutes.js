import express from 'express';
import { getHealthStatus, getQuickPing } from '../controllers/healthController.js';

const router = express.Router();

// GET /api/health - Detailed system & database health check
router.get('/health', getHealthStatus);

// GET /api/ping - Simple liveness probe
router.get('/ping', getQuickPing);

export default router;


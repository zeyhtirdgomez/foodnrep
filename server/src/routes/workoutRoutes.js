import getWorkout from '../controllers/workoutController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import logger from '../middlewares/logger.js';
import express from 'express';

const router = express.Router();

router.get('/', logger, authMiddleware, getWorkout);
export default router;
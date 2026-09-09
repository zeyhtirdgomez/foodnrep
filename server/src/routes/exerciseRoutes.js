import {
    getExercises, 
    getExercise, 
    createExercise, 
    updateExercise, 
    deleteExercise
} from '../controllers/exerciseController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import logger from '../middlewares/logger.js';
import express from 'express';

const router = express.Router();

router.get('/', logger, authMiddleware, getExercises);
router.get('/:id', logger, authMiddleware, getExercise);
router.post('/', logger, authMiddleware, createExercise);
router.patch('/:id', logger, authMiddleware, updateExercise);
router.delete('/:id', logger, authMiddleware, deleteExercise);

export default router;
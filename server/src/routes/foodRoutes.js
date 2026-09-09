import {
    getFoods, 
    getFood, 
    createFood, 
    updateFood, 
    deleteFood

} from '../controllers/foodController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import logger from '../middlewares/logger.js';
import express from 'express';

const router = express.Router();

router.get('/', logger, authMiddleware, getFoods);
router.get('/:id', logger, authMiddleware, getFood);
router.post('/', logger, authMiddleware, createFood);
router.patch('/:id', logger, authMiddleware, updateFood);
router.delete('/:id', logger, authMiddleware, deleteFood);

export default router;
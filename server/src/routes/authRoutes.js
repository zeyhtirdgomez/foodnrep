import {
    getMe,
    registerUser,
    updateUser,
    deleteUser
} from '../controllers/authController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import firebaseTokenMiddleware from '../middlewares/firebaseTokenMiddleware.js';
import logger from '../middlewares/logger.js';
import express from 'express';

const router = express.Router();

router.get('/me', logger, authMiddleware, getMe);
router.post('/register', logger, firebaseTokenMiddleware, registerUser);
router.patch('/', logger, authMiddleware, updateUser);
router.delete('/', logger, authMiddleware, deleteUser);

export default router;
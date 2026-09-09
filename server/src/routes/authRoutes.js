import {
    getMe,
    registerUser,
    loginUser,
    updateUser,
    deleteUser
} from '../controllers/authController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import logger from '../middlewares/logger.js';
import express from 'express';

const router = express.Router();

router.get('/me', logger, authMiddleware, getMe);
router.post('/register', logger, registerUser);
router.post('/login', logger, loginUser);
router.patch('/', logger, authMiddleware, updateUser);
router.delete('/', logger, authMiddleware, deleteUser);

export default router;
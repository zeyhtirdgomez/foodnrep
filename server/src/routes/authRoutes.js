import {
    getMe,
    registerUser,
    updateUser,
    deleteUser,
    deactivateUser,
    reactivateUser
} from '../controllers/authController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import firebaseTokenMiddleware from '../middlewares/firebaseTokenMiddleware.js';
import logger from '../middlewares/logger.js';
import express from 'express';

const router = express.Router();

router.get('/me', logger, authMiddleware, getMe);
router.post('/register', logger, firebaseTokenMiddleware, registerUser);
router.post('/reactivate', logger, firebaseTokenMiddleware, reactivateUser);
router.patch('/', logger, authMiddleware, updateUser);
router.post('/deactivate', logger, authMiddleware, deactivateUser);
router.delete('/', logger, authMiddleware, deleteUser);

export default router;
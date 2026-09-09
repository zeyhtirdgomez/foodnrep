import express from "express";

import {
    getMonthlyActivity
} from "../controllers/dashboardController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import logger from "../middlewares/logger.js";

const router = express.Router();

router.get(
    "/monthly",
    logger,
    authMiddleware,
    getMonthlyActivity
);

export default router;
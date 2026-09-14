import express from 'express';
import cors from 'cors';
import 'dotenv/config'

import connect from './src/config/db.js';

import errorMiddleware from './src/middlewares/errorMiddleware.js';
import notFoundMiddleware from './src/middlewares/notFoundMiddleware.js';

import authRouter from './src/routes/authRoutes.js';
import exerciseRouter from './src/routes/exerciseRoutes.js';
import foodRouter from './src/routes/foodRoutes.js';
import dashboardRouter from './src/routes/dashboardRoutes.js';
import workoutRouter from './src/routes/workoutRoutes.js';

const app = express();

const trustedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin : trustedOrigin,
    methods : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials : true
}));

app.use('/api/auth', authRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/foods', foodRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/workout', workoutRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');

        await connect();

        console.log('MongoDB connected.');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('SERVER STARTUP ERROR:');
        console.error(error);
        process.exit(1);
    }
};

startServer();
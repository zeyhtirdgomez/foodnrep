import mongoose from "mongoose";
import Exercise from "../models/Exercise.js";
import Food from "../models/Food.js";

const getMonthlyActivity = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const now = new Date();

        // First day of current month
        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        // First day of next month
        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        const [exerciseData, foodData] = await Promise.all([
            Exercise.aggregate([
                {
                    $match: {
                        userId,
                        createdAt: {
                            $gte: startOfMonth,
                            $lt: startOfNextMonth
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dayOfMonth: "$createdAt"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]),

            Food.aggregate([
                {
                    $match: {
                        userId,
                        createdAt: {
                            $gte: startOfMonth,
                            $lt: startOfNextMonth
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dayOfMonth: "$createdAt"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])
        ]);

        const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate();

        const monthlyActivity = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const exercise = exerciseData.find(
                item => item._id === day
            );

            const food = foodData.find(
                item => item._id === day
            );

            monthlyActivity.push({
                date: day,
                exercises: exercise ? exercise.count : 0,
                foods: food ? food.count : 0
            });
        }

        return res.status(200).json(monthlyActivity);

    } catch (error) {
        next(error);
    }
};

export {
    getMonthlyActivity
};
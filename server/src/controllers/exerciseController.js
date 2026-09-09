import Exercise from '../models/Exercise.js';

const getExercises = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const today = req.query.date? new Date(req.query.date) : new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const exercises = await Exercise.find({
            userId, 
            createdAt : {
                $gte : today,
                $lt : tomorrow
            }
        });

        return res.status(200).json(exercises);

    } catch (error){
        next (error);
    }
};

const getExercise = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const exercise = await Exercise.findOne({_id : req.params.id, userId});
        return res.status(200).json(exercise);
        
    } catch (error){
        next (error);
    }
};

const createExercise = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const {name, reps, sets, weight, time, category} = req.body;

        const data = {
            userId, name, reps, sets, weight, time, category
        };

        const exercise = await Exercise.create(data);

        return res.status(201).json(exercise);
    } catch (error) {
        next (error);
    }
};

const updateExercise = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const exercise = await Exercise.findOne({
            _id: id,
            userId
        });

        if (!exercise) {
            return res.status(404).json({
                message: "Exercise not found"
            });
        }

        const { name, reps, sets, weight, time, category } = req.body;

        if (name !== undefined) 
            exercise.name = name;
        
        if (reps !== undefined) 
            exercise.reps = reps;
        
        if (sets !== undefined) 
            exercise.sets = sets;
        
        if (weight !== undefined) 
            exercise.weight = weight;
        
        if (time !== undefined) 
            exercise.time = time;

        if (category !== undefined) 
            exercise.category = category;
        

        await exercise.save();

        return res.status(200).json({
            message: "Exercise updated successfully",
            exercise
        });

    } catch (error) {
        next(error);
    }
};

const deleteExercise = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const exercise = await Exercise.findOne({
            _id: id,
            userId
        });

        if (!exercise) {
            return res.status(404).json({
                message: "Exercise not found"
            });
        }

        await exercise.deleteOne();

        return res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};

export {
    getExercises, 
    getExercise, 
    createExercise, 
    updateExercise, 
    deleteExercise
};
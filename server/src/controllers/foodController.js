import Food from "../models/Food.js";

const getFoods = async (req, res, next) => {
    const userId = req.user.id;

    const today = req.query.date ? new Date(req.query.date) : new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1);
    
    try {
        const foods = await Food.find({
            userId,
            createdAt : {
                $gte : today,
                $lt : tomorrow
            } 
        });

        return res.status(200).json(foods)

    } catch (error) {
        next(error);
    }
};

const getFood = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const food = await Food.findOne({
            _id : req.params.id, 
            userId
        });

        return res.status(200).json(food);
    } catch (error) {
        next (error);
    }
};

const createFood = async (req, res, next) => {
    try {
        const { name, grams } = req.body;
        let { calories } = req.body;

        const userId = req.user.id;

        if (!name || !grams) {
            return res.status(400).json({
                message: "Name and grams are required"
            });
        }

        if (calories === undefined || calories === null) {
            const response = await fetch(
                `https://calorieapiadmin.com/api/v1/search/foods?q=${encodeURIComponent(name)}`,
                {
                    headers: {
                        "X-API-Key": process.env.CALORIE_API,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    "Calorie API error:",
                    response.status,
                    errorText
                );

                return res.status(502).json({
                    message: "Failed to fetch nutrition data"
                });
            }

            const data = await response.json();
            console.log(data);
            if (!data.data || data.data.length === 0) {
                return res.status(404).json({
                    message: "Food not found"
                });
            }

            const food = data.data[0];

            const caloriesPer100g = food.calories_100g;

            calories = (caloriesPer100g / 100) * grams;
        }

        const food = await Food.create({
            userId,
            name,
            calories,
            grams
        });

        return res.status(201).json({
            message: "Food created successfully",
            food
        });

    } catch (error) {
        console.error("createFood error:", error);
        next(error);
    }
};

const updateFood = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const food = await Food.findOne({
            _id: id,
            userId
        });

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        const { name, grams, calories } = req.body;

        if (name !== undefined) 
            food.name = name;
        
        if (grams !== undefined) 
            food.grams = grams;
        
        if (calories !== undefined)
            food.calories = calories;
    
        await food.save();

        return res.status(200).json({
            message: "Food updated successfully",
            food
        });

    } catch (error) {
        next(error);
    }
};

const deleteFood = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const food = await Food.findOneAndDelete({
            _id : id, 
            userId
        });

        if (!food)
            return res.status(404).json({
                message : 'Food not found'
            })

        return res.sendStatus(204);
    } catch (error) {
        next (error);
    }
};

export {
    getFoods, 
    getFood, 
    createFood, 
    updateFood, 
    deleteFood
};
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getMe = async (req, res, next) => {
    try {
        const _id = req.user.id;
        const user = await User.findById(_id);

        if (!user)
            return res.status(400).json({
                message : 'Invalid ID'
            });

        const {name, weight, height, BMI} = user;

        return res.status(200).json({
            name,
            weight,
            height,
            BMI
        })
    } catch (error) {
        next(error);
    }
}

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, weight, height } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const BMI = weight > 0 && height > 0
            ? weight / ((height / 100) ** 2)
            : 0;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            weight,
            height, 
            BMI
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                weight: user.weight,
                height: user.height,
                BMI: user.BMI
            }
        });

    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                weight: user.weight,
                height: user.height,
                BMI: user.BMI
            }
        });

    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { name, email, password, weight, height } = req.body;

        if (name !== undefined) 
            user.name = name;

        if (email !== undefined) 
            user.email = email;

        if (password !== undefined) 
            user.password = await bcrypt.hash(password, 10);

        if (weight !== undefined) 
            user.weight = weight;

        if (height !== undefined) 
            user.height = height;

        // Calculate BMI if both values are available
        if (user.weight > 0 && user.height > 0) {
            user.BMI = user.weight / Math.pow(user.height / 100, 2);
        }

        await user.save();

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                weight: user.weight,
                height: user.height,
                BMI: user.BMI
            }
        });

    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await user.deleteOne();

        return res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};

export {
    getMe,
    registerUser,
    loginUser,
    updateUser,
    deleteUser
};
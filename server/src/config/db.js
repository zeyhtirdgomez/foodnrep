import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connect = async () => {
    
    if (!MONGO_URI) {
        console.error('Error MONGO_URI env is missing.');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB is running on ${conn.connection.host}`);
    
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connect;
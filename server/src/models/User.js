import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid : {
        type : String,
        unique : true,
        sparse : true
    },
    name : {
        type : String,
        required : [true, 'Name is required']
    },
    email : {
        type : String,
        required : [true, 'Email address is required'],
        lowercase : true,
        trim : true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        select : false
    },
    weight : {
        type : Number,
        default : 0,
        min : 0
    },
    height : {
        type : Number,
        default : 0,
        min : 0
    },
    BMI : {
        type : Number,
        default : 0,
        min : 0
    }
}, {timestamps : true});

const User = mongoose.model('User', userSchema);

export default User;
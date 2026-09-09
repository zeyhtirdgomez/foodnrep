import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Name is required']
    },
    email : {
        type : String,
        required : [true, 'Email address is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : true
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
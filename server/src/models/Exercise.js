import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        index : true
    },
    name : {
        type : String,
        required : true,
        trim : true,
        maxLength : 50
    },
    reps : {
        type : Number,
        default : 0,
        min : 0
    },
    sets : {
        type : Number,
        default : 0,
        min : 0
    },
    weight : {
        type : Number,
        default : 0,
        min : 0
    },
    time : {
        type : Number,
        default : 0,
        min : 0
    },
    category : {
        type : String,
        enum : ['arm', 'shoulder', 'chest', 'back', 'core', 'leg'],
        required : true
    }
}, {timestamps : true});

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
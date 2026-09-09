import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
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
    calories : {
        type : Number,
        default : 0,
        min : 0
    },
    grams : {
        type : Number,
        default :  0,
        min : 0
    }
}, {timestamps : true});

const Food = mongoose.model('Food', foodSchema);

export default Food;

import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required : true,
        minLength : 4,
        maxLength : 10 , 
    },
    lastName : {
        type: String
    },
    emailID:{
        type : String,
        require: true,
        unique: true,
        trim : true,
    },
    password: {
        type : String,
    },
    age: {
        type: Number,
    },
    skills : {
        type : [String],
        default : ["javascript" , "python"]
    },
    gender : {
        type : String , 
        validate(value) {
            if(!["male"  , "female" , "others"].includes(value)){
                throw new Error("enter a valid gender , this is not the united fucking states of america")
            }
        }
    },
    photoUrl : {
        type : String,
        default : "https://www.transparentpng.com/cats/user-2132.html"
    },
    about : {
        type : String , 
        default : "This is the about section of the user"
    }
});

export const User = mongoose.model("User" , userSchema);
 
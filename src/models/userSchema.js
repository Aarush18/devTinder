
import mongoose from "mongoose";
import validator from "validator"

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required : true,
        minLength : 4,
        maxLength : 10 , 
        trim: true
    },
    lastName : {
        type: String,
        trim : true
    },
    emailID:{
        type : String,
        required: true,
        unique: true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid " + value);
            }
        }
    },
    password: {
        type : String,
        required: true,
        minLength : 5,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error ("Password is too weak " + value)
            }
        }     
    },
    age: {
        type: Number,
        validate(value){
            if(value < 18){
                throw new Error("user is underage for this platform")
            }
        }
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
        default : "This is the about section of the user",
        validate(value){
            if(value.length > 100){
                throw new Error("Keep the about section under 100 words");
            }
        }
    }
} , {timestamps : true});

export const User = mongoose.model("User" , userSchema);
 
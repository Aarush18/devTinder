
import jwt from "jsonwebtoken"
import { User } from "../models/userSchema.js";
export const authMiddleware = (req , res , next) => {
    const token = "xyz";
    const isAdmin = token === "xyz";
    console.log("auth is being checked");
    if(isAdmin){
        next();
    }
    else{
        console.error("Not authorized")
    }
}

export const userAuth = async (req , res , next) => {

    try {
        const {token} = req.cookies;
        const decoded = jwt.verify(token , "tmkc" );

        const userID = decoded._id;

        const user = await User.findById(userID);

        if(!user){
            return res.status(404).send("User not found");
        }

        req.user = user;

        next();

    } catch (error) {
        res.status(404).send("some error occured " + error.message)
    }

    
}

// module.exports({
//     authMiddleware
// })
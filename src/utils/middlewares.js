
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

export const userAuth = (req , res , next) => {
    const token = "xyz";
    const isUserAuthorized = token ==="xyz";

    if(req.path == "/login") {
        res.send("Not found");
        return null
    }
    if(isUserAuthorized){
        console.log("Accesss given")
        next();
    }else{
        console.error("Not authorized");
    }
}

// module.exports({
//     authMiddleware
// })
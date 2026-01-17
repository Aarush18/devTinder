import validator from "validator"

export const validateSignupData = (req) => {
    const {firstName , lastName , emailID , password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Enter a name");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }
    if(!validator.isEmail(emailID)){
        throw new Error("Enter a valid email id");
    }
}


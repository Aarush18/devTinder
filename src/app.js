import express from "express";
import connectDB from "./config/db.js";
import { authMiddleware, userAuth } from "./utils/middlewares.js";
import { User } from "./models/userSchema.js";
import { validateSignupData } from "./utils/validators/signUpValidator.js";
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/admin", authMiddleware, (req, res) => {
  res.send("Admin is accessed");
});


app.post("/signup" , async (req ,res) => {


    try {
      validateSignupData(req);
    } catch (error) {
      return res.status(400).send(error.message)
    }

    //hashing password
    const {firstName , lastName , emailID , password} = req.body;

    const hashedPassword = await bcrypt.hash(password , 10);
    console.log(hashedPassword);

    const user = await User.findOne({emailID : emailID});

    try {
      if(user){
        return res.status(400).send("User already present in DB");
      }
    } catch (error) {
      throw new Error(error.message);
    }

    const userdata = new User({
      firstName ,
      lastName ,
      emailID , 
      password : hashedPassword
    })

    try {
        await userdata.save();
        console.log("Success")
        res.send("New user is added in db")
    } catch (error) {
        res.status(404).send("Something went wrong" + error.message)
        console.error(error.message)
    }
})

app.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    if (!emailID || !password) {
      return res.status(400).send("Email and password are required");
    }

    if (!validator.isEmail(emailID)) {
      return res.status(401).send("Invalid credentials");
    }

    const user = await User.findOne({ emailID });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isAllowed = await bcrypt.compare(password, user.password);
    if (!isAllowed) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({_id : user._id} , "tmkc" , {
      expiresIn : "1d"
    });

    res.cookie("token" , token);

    // success
    return res.status(200).send(user);

  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

app.get("/profile" , userAuth , async (req , res) => {
  try {
    const user = req.user;
    return res.send(user);

  } catch (error) {
    res.status(404).send("Some error occured" + error.message)
    throw new Error(error.message);
  }
})

app.post("/sendConnectionRequest" , userAuth , async(req , res) => {
    try {
      const user = req.user;

      console.log("Sending connection request");

      res.send(user.firstName + "Sent the connection request");
    } catch (error) {
      res.status(404).send(error.message);
    }
})


app.get("/users" , async (req , res) => {
  const emailID = req.body.emailID;
  try {
    const users = await User.find({emailID: emailID});
    if(users.length === 0){
      res.send("No users found");
    }else{
      res.send(users);
    }
  } catch (error) {
    res.status(404).send("Something went wrong")
  }
})

app.get("/feed" , async(req , res) => {
  try {
    const user = await User.find({});
    if(user.length === 0){
      res.send("No users in DB");
    }else{
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("Something went wrong")
  }
})

app.get("/user/:id" , async(req , res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if(!user){
      res.send("User not found");
    }else{
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("Something went wrong")
  }
})

app.delete("/user" , async(req , res) => {
  const emailID = req.body.emailID;
  try {
    const user = await User.deleteMany({emailID});
    if(!user){
      res.send("User not found");
    }else{
      res.send("User deleted successfully");
    }
  } catch (error) {
    res.status(404).send("Something went wrong")
    console.error(error.message);
  }
})

app.patch("/user/:userID" , async (req , res) => {

  const userID = req.params.userID;
  const data = req.body;

  const ALLOWED_UPDATES = ["age" , "gender" , "skills" , "about" , "photoUrl"];

  try {
    const isAllowed = Object.keys(data).every(
      k => ALLOWED_UPDATES.includes(k)
    );

    if(!isAllowed){
      return res.status(400).send("Update is not allowed");
    }
    
  } catch (error) {
    return res.status(404).send("Some error occured " + error.message);
  }

  if(data?.skills && data.skills.length > 10){
    return res.status(400).send("Skills should be lower than 10");
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id : userID },
      data,
      { new: true, runValidators: true }
    );

    if(!user){
      res.status(404).send("User not found");
    }else{
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("Something went wrong");
    console.error(error.message);
  }
})

const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

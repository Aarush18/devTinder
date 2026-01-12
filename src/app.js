import express from "express";
import connectDB from "./config/db.js";
import { authMiddleware, userAuth } from "./utils/middlewares.js";
import { User } from "./models/userSchema.js";

const app = express();
app.use(express.json());

app.get("/admin", authMiddleware, (req, res) => {
  res.send("Admin is accessed");
});


app.post("/signup" , async (req ,res) => {

    const userdata = new User(req.body)

    try {
        await userdata.save();
        console.log("Success")
        res.send("New user is added in db")
    } catch (error) {
        res.status(404).send("Something went wrong" + error.message)
        console.error(error.message)
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

app.patch("/user" , async (req , res) => {
  const emailID = req.body.emailID;
  const data = req.body;

  try {
    const user = await User.findOneAndUpdate({emailID} , data);
    if(!user){
      res.status(404).send("User not found");
    }else{
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("Something went wrong")
    console.error(error.message);
  }
})

const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

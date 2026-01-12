import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://aarushgupta2018_db_user:xT84bToI6tFK2EyT@cluster0.ijpqvlc.mongodb.net/myapp?appName=Cluster0"
    );
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed");
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;

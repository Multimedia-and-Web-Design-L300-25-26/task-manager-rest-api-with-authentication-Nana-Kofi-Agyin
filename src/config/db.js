import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use a short server selection timeout so tests fail fast when MongoDB
    // isn't available in the local environment.
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed", error.message || error);
    // Don't exit the process here - allow the test runner to continue so
    // failures are reported by the tests instead of abruptly terminating.
  }
};

export default connectDB;
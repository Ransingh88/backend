import mongoose from "mongoose";
import { DB_NAME } from "../../constants/constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  }
};

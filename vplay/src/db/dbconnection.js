import mongoose from "mongoose";
import { MONGODB_URI, DB_NAME } from "../constants/config.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `\n MongoDB Connected! \n Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MongoDB Connection Failed: ", error);
    process.exit(1);
  }
};

export default connectDB;

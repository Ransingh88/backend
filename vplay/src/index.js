import dotenv from "dotenv";
import connectDB from "./db/dbconnection.js";
import { app } from "./app.js";
import { PORT } from "./constants/config.js";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(" ERR : ", error);
  });

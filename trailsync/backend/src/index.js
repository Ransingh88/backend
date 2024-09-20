import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/config/databaseConnection.js";

// configuration
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 4000;

// DB connection
connectDB().then(
  // start server
  app.listen(PORT, () => {
    console.log(
      `Server running in "${process.env.NODE_ENV}" mode on port ${PORT}`,
    );
  }),
);

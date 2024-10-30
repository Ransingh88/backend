import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({ path: "./.env" });

export const app = express();

export const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new client connected: ", socket.id);

  socket.on("sendLocation", (locationData) => {
    console.log("data: ", locationData);
    io.emit("updateLocation", locationData);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected :", socket.id);

    io.emit("removeLocation", socket.id);
  });
});

// configs
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());

// route imports
import userRoutes from "./routes/user.routes.js";

app.use("/api/v1/user", userRoutes);

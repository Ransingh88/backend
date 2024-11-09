import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

dotenv.config({ path: "./.env" });

export const app = express();

export const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.request.headers.cookie
    ? cookie.parse(socket.request.headers.cookie).accessToken
    : null;

  if (token) {
    const decodedJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = decodedJWT._id;
    next();
  }
});

let centralizedStore = {
  clients: {},
};

io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);
  socket.emit("initialData", centralizedStore);

  socket.on("sendLocation", (locationData) => {
    centralizedStore.clients[socket.id] = locationData;
    io.emit("updateLocation", centralizedStore);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected X-:", socket.id);
    delete centralizedStore.clients[socket.id];
    io.emit("updateLocation", centralizedStore);
    // io.emit("removeLocation", socket.id);
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

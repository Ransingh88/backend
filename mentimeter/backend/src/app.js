import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "16kb" }));
// mongodb Connection
const dbConnection = async () => {
  try {
    const ci = await mongoose.connect("mongodb://localhost:27017/mentimeter");
    console.log("mongoDB connected successfully");
  } catch (error) {
    console.log("mongodb connection failed", error);
  }
};

dbConnection();

io.on("connection", (socket) => {
  console.log("new client connected: ", socket.id);

  socket.on("createSession", (sessionCode) => {
    socket.join(sessionCode);
    console.log(`Admin created session: ${sessionCode}`);
  });

  socket.on("joinSession", ({ sessionCode, userId }) => {
    socket.join(sessionCode);
    console.log("new client join the room: ", sessionCode, userId);
    console.log("socket: ", socket.adapter.rooms.get(sessionCode));
  });

  socket.on(
    "publish-question",
    ({ sessionCode, question, options, questionId, questionNum }) => {
      io.to(sessionCode).emit("receive-question", {
        question,
        options,
        questionId,
        questionNum,
      });
      console.log(`message sent to room ${sessionCode}`);
    }
  );

  socket.on("disconnect", () => {
    console.log("client disconnected X-:", socket.id);
  });
});

import userRoutes from "./routes/user.routes.js";

app.use("/api", userRoutes);

httpServer.listen(3000, () => {
  console.log("server is running on port 3000");
});

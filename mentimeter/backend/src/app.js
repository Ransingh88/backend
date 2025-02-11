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

  socket.on("submit-answer", async (answerData) => {
    console.log(answerData);

    const { sessionCode, userId, name, answer } = answerData;
    const isAnsCorrect = await Session.aggregate([
      {
        $match: {
          sessionCode: sessionCode,
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quizDetails",
        },
      },
      {
        $unwind: "$quizDetails",
      },
      {
        $unwind: "$quizDetails.questions",
      },
      {
        $match: {
          "quizDetails.questions._id": new mongoose.Types.ObjectId(
            answer.questionId
          ),
        },
      },
      {
        $project: {
          isCorrect: {
            $eq: [
              "$quizDetails.questions.correctOption",
              answer.selectedOption,
            ],
          },
        },
      },
    ]);

    socket.emit("answer-feedback", {
      isAnsCorrect: isAnsCorrect[0].isCorrect,
      responseTime: answer.ansResponseTime,
    });

    // save answer response
    quizResponseSubmit(
      sessionCode,
      name,
      answer,
      userId,
      isAnsCorrect[0].isCorrect
    );
  });

  socket.on("disconnect", () => {
    console.log("client disconnected X-:", socket.id);
  });
});

import userRoutes from "./routes/user.routes.js";
import { Quiz } from "./models/quiz.model.js";
import { Session } from "./models/session.model.js";
import { quizResponseSubmit } from "./controllers/user.controller.js";

app.use("/api", userRoutes);

httpServer.listen(3000, () => {
  console.log("server is running on port 3000");
});

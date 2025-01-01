import { Quiz } from "../models/quiz.model.js";
import { Response } from "../models/response.model.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";

const userRegister = async (req, res) => {
  try {
    const { name, role, password } = req.body;

    const response = await User.create({ name, password, role });

    res
      .status(201)
      .json({ message: "user created successfully", data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const userResponse = await User.find({ name });
    console.log(userResponse);

    if (!userResponse[0]) {
      throw new Error("user not found");
    }

    if (userResponse[0].password !== password) {
      throw new Error("wrong password");
    }

    res.status(200).json({ message: "user logged in", data: userResponse[0] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, createdBy } = req.body;

    const response = await Quiz.create({
      title,
      description,
      questions,
      createdBy,
    });

    res
      .status(200)
      .json({ message: "quiz created successfully", data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllQuiz = async (req, res) => {
  try {
    const response = await Quiz.find();

    res
      .status(200)
      .json({ message: "all quizzes fetched successfully", data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    console.log(req.params);

    if (!quizId) {
      throw new Error("No QuizId found");
    }

    const response = await Quiz.findById(quizId);

    res
      .status(200)
      .json({ message: "quiz fetched successfully", data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const quizSessionStart = async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      throw new Error("provide quizId");
    }

    const response = await Quiz.findById(quizId);

    if (!response) {
      throw new Error("No quiz found, try create one!");
    }

    const sessionCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    await Session.create({ quizId, sessionCode, isActive: true });
    res.status(200).json({ message: "quiz session started", sessionCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const quizSessionJoin = async (req, res) => {
  try {
    const { sessionCode } = req.body;
    if (!sessionCode || sessionCode == "") {
      throw new Error("pease enter valid sessionCode");
    }

    const response = await Session.find({ sessionCode });

    if (!response) {
      throw new Error("pease enter valid sessionCode");
    }
    if (!response[0]?.isActive) {
      throw new Error("Session is not active, try different.");
    }
    //   will add socket code to join a room
    res.status(200).json({ message: "quiz session joined.", sessionCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const quizSessionEnd = async (req, res) => {
  try {
    const { sessionCode } = req.body;

    const response = await Session.findOneAndUpdate(
      { sessionCode },
      { isActive: false }
    );
    res.status(200).json({ message: "quiz session ended", sessionCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const quizSessionDelete = async (req, res) => {
  try {
    const { sessionCode } = req.body;

    await Session.findOneAndDelete({ sessionCode });
    res
      .status(200)
      .json({ message: "quiz session deleted successfully", sessionCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const quizResponseSubmit = async (req, res) => {
  try {
    const { sessionCode, name, answer } = req.body;

    const isUserExists = await Response.findOne({
      $and: [{ name }, { sessionCode }],
    });

    if (!isUserExists) {
      const response = await Response.create({
        sessionCode,
        name,
        answers: [answer],
      });

      console.log("createRes", response);
    } else {
      const response = await Response.findOneAndUpdate(
        {
          name,
        },
        { $push: { answers: answer } }
      );

      console.log("updateRes", response);
    }

    res.status(200).json({ message: "response submitted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    await Quiz.findByIdAndDelete(quizId);

    res.status(200).json({ message: "quiz deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const responseResult = async (req, res) => {
  try {
    const { sessionCode } = req.params;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    const responseDate = await Quiz.findByIdAndUpdate(quizId, req.body);
    res.status(200).json({ message: "quiz updated", data: responseDate });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  userRegister,
  userLogin,
  createQuiz,
  getAllQuiz,
  getQuiz,
  quizSessionStart,
  quizSessionJoin,
  quizSessionEnd,
  quizSessionDelete,
  quizResponseSubmit,
  responseResult,
  deleteQuiz,
  updateQuiz,
};

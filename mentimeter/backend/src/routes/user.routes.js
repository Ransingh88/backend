import { Router } from "express";
import {
  createQuiz,
  deleteQuiz,
  getAllQuiz,
  getQuiz,
  quizResponseSubmit,
  quizSessionDelete,
  quizSessionEnd,
  quizSessionJoin,
  quizSessionStart,
  responseResult,
  updateQuiz,
  userLogin,
  userRegister,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/auth/register").post(userRegister);
router.route("/auth/login").post(userLogin);
router.route("/quiz/create").post(createQuiz);
router.route("/quiz/update/:quizId").patch(updateQuiz);
router.route("/quiz/delete/:quizId").delete(deleteQuiz);
router.route("/quiz").get(getAllQuiz);
router.route("/quiz/:quizId").get(getQuiz);
router.route("/session/start").post(quizSessionStart);
router.route("/session/join").post(quizSessionJoin);
router.route("/session/end").post(quizSessionEnd);
router.route("/session/delete").delete(quizSessionDelete);
router.route("/response/submit").post(quizResponseSubmit);
router.route("/response/result/:sessionCode").get(responseResult);

export default router;

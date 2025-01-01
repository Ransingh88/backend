import { configureStore } from "@reduxjs/toolkit";
import quizSlice from "./features/quizSlice.js";
import questionSlice from "./features/questionSlice.js";

export const store = configureStore({
  reducer: {
    quiz: quizSlice,
    question: questionSlice,
  },
});

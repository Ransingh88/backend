import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "untitle",
  description: "",
  questions: [],
};

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    clearQuizState: (state) => {
      state.title = "untitle";
      state.description = "";
      state.questions = [];
    },
    addTitle: (state, action) => {
      state.title = action.payload;
    },
    addDescription: (state, action) => {
      state.description = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
    },
    addBulkQuestion: (state, action) => {
      state.questions = action.payload;
    },
    updateQuestion: (state, action) => {
      const { id, question } = action.payload;
      const filtereQquestion = state.questions.find(
        (q) => q.questionSerielNumber == id
      );
      if (filtereQquestion) {
        filtereQquestion.question = question;
      }
    },
    addOption: (state, action) => {
      const { id } = action.payload;
      const question = state.questions.find(
        (q) => q.questionSerielNumber == id
      );
      if (question) {
        question.options.push("");
      }
    },
    updateOption: (state, action) => {
      const { id, optionValue, optionIndex } = action.payload;
      const question = state.questions.find(
        (q) => q.questionSerielNumber == id
      );
      if (question) {
        question.options[optionIndex] = optionValue;
      }
    },
    deleteOption(state, action) {
      const { id, optionIndex } = action.payload;
      const question = state.questions.find(
        (q) => q.questionSerielNumber == id
      );
      if (question) {
        question.options.splice(optionIndex, 1);
      }
    },
    updateCorrectOption: (state, action) => {
      const { id, correctOption } = action.payload;
      const question = state.questions.find(
        (q) => q.questionSerielNumber == id
      );
      if (question) {
        question.correctOption = correctOption;
      }
    },
    updateQuestionType: (state, action) => {
      const { id, questionType } = action.payload;
      const question = state.questions.find(
        (q) => q.questionSerielNumber == id
      );
      if (question) {
        question.questionType = questionType;
      }
    },
    deleteQuestion: (state, action) => {
      state.questions = state.questions.filter(
        (q) => q.questionSerielNumber !== action.payload
      );
    },
  },
});

export const {
  addQuestion,
  addBulkQuestion,
  updateQuestion,
  updateCorrectOption,
  addOption,
  updateOption,
  deleteOption,
  updateQuestionType,
  deleteQuestion,
  addTitle,
  addDescription,
  clearQuizState,
} = questionSlice.actions;
export default questionSlice.reducer;

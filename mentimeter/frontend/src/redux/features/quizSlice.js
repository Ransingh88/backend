import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionCode: null,
  userName: null,
  details: {},
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setSessionCode: (state, actions) => {
      state.sessionCode = actions.payload;
    },
    setUserName: (state, actions) => {
      state.userName = actions.payload;
    },
  },
});

export const { setSessionCode, setUserName } = quizSlice.actions;
export default quizSlice.reducer;

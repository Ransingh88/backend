import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  socketActiveUsers: {},
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users = action.payload;
    },
    addSocketUser: (state, action) => {
      state.socketActiveUsers = action.payload;
    },
  },
});

export const { addUser, updateStatus, addSocketUser } = userSlice.actions;

export default userSlice.reducer;

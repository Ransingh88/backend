import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users = action.payload;
    },
    updateStatus: (state, action) => {
      state.users = state.users.map((user) => {
        if (action.payload.includes(user._id)) {
          return { ...user, status: true };
        } else return { ...user, status: false };
      });
    },
  },
});

export const { addUser, updateStatus } = userSlice.actions;

export default userSlice.reducer;

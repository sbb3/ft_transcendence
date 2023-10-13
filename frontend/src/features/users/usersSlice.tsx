import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  currentUser: object | null;
}

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state: UserState, action) => {
      state.currentUser = action.payload;
    },
    removeUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

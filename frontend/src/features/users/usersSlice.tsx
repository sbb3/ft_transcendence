import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  currentUser: object | null;
  onlineUsers: number;
}

const initialState = {
  currentUser: null,
  onlineUsers: 0,
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
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setCurrentUser, removeUser, setOnlineUsers } = userSlice.actions;

export default userSlice.reducer;

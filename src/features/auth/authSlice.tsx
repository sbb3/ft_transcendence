import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   accessToken: null,
//   userId: 0,
// };

const auth = localStorage?.getItem("auth");
const authObj = JSON.parse(auth);
const token = authObj?.accessToken;
const userId = authObj?.userId;

const initialState = {
  accessToken: token,
  userId,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
    setUserLoggedOut: (state) => {
      state.accessToken = null;
      state.userId = 0;
    },
  },
});

export const { setUserLoggedIn, setUserLoggedOut } = authSlice.actions;
export default authSlice.reducer;

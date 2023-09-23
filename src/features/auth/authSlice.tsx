import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
// 	accessToken: null,
// 	user: null,
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
    setLogin: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
    setLogout: (state) => {
      state.accessToken = null;
      state.userId = null;
    },
    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
    userLoggedOut: (state) => {
      state.accessToken = null;
      state.userId = null;
    },
  },
});

export const { setLogin, setLogout, userLoggedIn, userLoggedOut } =
  authSlice.actions;
export default authSlice.reducer;

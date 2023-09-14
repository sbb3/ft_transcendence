import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
// 	accessToken: null,
// 	user: null,
// };

const auth = localStorage?.getItem("auth");
const authObj = JSON.parse(auth);
const token = authObj?.accessToken;
const user = authObj?.user;

const initialState = {
  accessToken: token,
  user: { ...user },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.accessToken = null;
      state.user = null;
    },
    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setLogin, setLogout, userLoggedIn, userLoggedOut } =
  authSlice.actions;
export default authSlice.reducer;

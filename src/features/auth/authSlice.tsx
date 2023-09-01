import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	accessToken: null,
	user: null,
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
	},
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;

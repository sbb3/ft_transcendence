import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	accessToken: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			state.accessToken = action.payload.accessToken;
		},
		logOut: (state) => {
			state.accessToken = null;
		},
	},
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

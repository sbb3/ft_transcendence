import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userCurrentLocation: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setUserCurrentLocation: (state, action) => {
      state.userCurrentLocation = action.payload;
    },
  },
});

export const { setUserCurrentLocation } = locationSlice.actions;
export default locationSlice.reducer;

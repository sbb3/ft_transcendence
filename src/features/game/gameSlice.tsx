import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchmakingLoading: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setMatchmakingLoading: (state, action) => {
      state.matchmakingLoading = action.payload;
    },
  },
});

export const { setMatchmakingLoading } = gameSlice.actions;

export default gameSlice.reducer;

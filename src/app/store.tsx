import { configureStore, MiddlewareArray } from "@reduxjs/toolkit";
import authReducer from "src/features/auth/authSlice";
import locationReducer from "src/features/locationSlice";
import conversationsReducer from "src/features/conversations/conversationsSlice";
import userReducer from "src/features/users/usersSlice";
import gameReducer from "src/features/game/gameSlice";
import { apiSlice } from "src/app/api/apiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    location: locationReducer,
    conversations: conversationsReducer,
    user: userReducer,
    game: gameReducer,
  },
  middleware: (
    getDefaultMiddleware: MiddlewareArray // enables caching, invalidation and other features of `rtk-query`
  ) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

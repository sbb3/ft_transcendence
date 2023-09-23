import { apiSlice } from "../../app/api/apiSlice";
import { setCurrentUser } from "../users/usersSlice";
import { setLogout, setLogin, userLoggedIn } from "./authSlice";

const authApiEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendLogIn: builder.mutation({
      query: (credentials: any) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: userInfo } = await queryFulfilled;
          // TODO: dispatch action to update user state and access token state
          // dispatch(setLogin(userInfo));
        } catch (err: any) {
          console.log(`err: `, err);
          return;
        }
      },
    }),
    sendLogOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // TODO: dispatch action to update user state and access token state

          dispatch(setLogout());
        } catch (err: any) {
          console.log(`err: `, err);
          return;
        }
      },
    }),
    getNewAccessToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: userInfo } = await queryFulfilled;
          // !! rename newAccessToken to accessToken
          // !! const accessToken = data?.data?.newAccessToken;
          // console.log(`newAccessToken: ${accessToken}`);
          dispatch(setLogin(userInfo));
        } catch (err: any) {
          console.log(`err: `, err);
          return;
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: result.data.accessToken,
              userId: result.data.user.id,
            })
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              userId: result.data.user.id,
            })
          );

          // dispatch(setCurrentUser(result.data.user));
        } catch (err) {
          // do nothing
        }
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: result.data.accessToken,
              userId: result.data.user.id,
            })
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              userId: result.data.user.id,
            })
          );

          // dispatch(setCurrentUser(result.data.user));
        } catch (err) {
          // do nothing
        }
      },
    }),
  }),
});

export const {
  useSendLogInMutation,
  useSendLogOutMutation,
  useGetNewAccessTokenMutation,
  useLoginMutation,
  useRegisterMutation,
} = authApiEndpoints;

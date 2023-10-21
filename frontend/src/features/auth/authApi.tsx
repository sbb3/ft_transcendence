import { apiSlice } from "../../app/api/apiSlice";
import { removeUser, setCurrentUser } from "../users/usersSlice";
import { setUserLoggedIn, setUserLoggedOut } from "./authSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendLogOut: builder.mutation({
      query: (userId) => ({
        url: "/auth/logout",
        method: "POST",
        body: { userId },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(setUserLoggedOut());
          dispatch(removeUser()); // clear user data
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
          const result = await queryFulfilled;
          dispatch(
            setUserLoggedIn({
              accessToken: result?.data?.accessToken,
              userId: Number(result?.data?.user.id),
            })
          );

          dispatch(setCurrentUser(result?.data?.user));
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
            setUserLoggedIn({
              accessToken: result.data.accessToken,
              userId: result.data.user.id,
            })
          );

          dispatch(setCurrentUser(result.data.user));
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
            setUserLoggedIn({
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
  useSendLogOutMutation,
  useGetNewAccessTokenMutation,
  useLoginMutation,
  useRegisterMutation,
} = authApi;

export default authApi;

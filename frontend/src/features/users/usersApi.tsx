import { apiSlice } from "src/app/api/apiSlice";
import { setCurrentUser } from "./usersSlice";
import { createSocketClient } from "src/app/socket/client";

interface Friend {
  id: number;
  name: string;
  username: string;
  avatar: string;
  email: string;
}

interface FriendsList {
  friends: Friend[];
}

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getUsers: builder.query({
      query: () => "users",
      async onCacheEntryAdded(
        arg: any,
        { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any
      ) {
        const socket = createSocketClient();
        try {
          await cacheDataLoaded;
          socket.on("newuser", (data: any) => {
            console.log("incoming newuser: ", data);
            updateCachedData((draft: any) => {
              const user = draft?.find((u: any) => u.id === data?.data?.id);
              if (!user?.id) draft?.push(data?.data);
            });
            // dispatch(
            //   usersApi.util.prefetch("getUsers", undefined, {
            //     force: true,
            //   } as any)
            // );
          });
        } catch (error) {
          console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    getUserById: builder.query({
      query: (id: number) => `users/${id}`, // users/id return object {}, users?id=1, return array []
    }),
    getUserByUsername: builder.query({
      query: (username: string) => `users/username/${username}`,
    }),
    getUserByEmail: builder.query({
      query: (email: string) => `users/email/${email}`,
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    getCurrentUser: builder.query({
      query: (currentUserId) => ({
        url: `/users/currentuser/${currentUserId}`,
        method: "GET",
        // mode: "no-cors"
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    updateUserSettings: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `users/${id}/settings`,
        method: "PATCH",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    getFriends: builder.query({
      query: (id) => `users/${id}/friends`,
    }),
    addFriend: builder.mutation({
      query: ({ currentUserId, friendId }) => ({
        url: `users/${currentUserId}/friends`,
        method: "POST",
        body: { friendId },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // invalidate the cache for getFriends
        try {
          const result = await queryFulfilled;
          // await dispatch(
          //   usersApi.util.prefetch(
          //     "getFriends",
          //     getState()?.user?.currentUser?.id,
          //     {
          //       force: true,
          //     } as any
          //   )
          // );
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    deleteFriend: builder.mutation({
      query: ({ currentUserId, friendId }) => ({
        url: `users/${currentUserId}/friends/${friendId}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // invalidate the cache for getFriends
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    generateOTP: builder.mutation({
      query: (userId) => ({
        url: `otp-generate`,
        method: "POST",
        body: { userId },
      }),
    }),
    verifyOTP: builder.mutation({
      query: ({ userId, userPin }) => ({
        url: `otp-verify`,
        method: "POST",
        body: { userId, userPin },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    validateOTP: builder.mutation({
      query: ({ userId, userPin }) => ({
        url: `otp-validate`,
        method: "POST",
        body: { userId, userPin },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    disableOTP: builder.mutation({
      query: (userId) => ({
        url: `otp-disable`,
        method: "POST",
        body: { userId },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    checkProfileCompleted: builder.mutation({
      query: (userId) => ({
        url: `profile-check-completed`,
        method: "POST",
        body: { userId },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    blockUser: builder.mutation({
      query: ({ id, blockedUserId }) => ({
        url: `users/${id}/blockuser`,
        method: "PATCH",
        body: { blockedUserId },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    unblockUser: builder.mutation({
      query: ({ id, blockedUserId }) => ({
        url: `users/${id}/unblockuser`,
        method: "PATCH",
        body: { blockedUserId },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByUsernameQuery,
  useGetUserByEmailQuery,
  useGetFriendsQuery,
  useAddFriendMutation,
  useGetCurrentUserQuery,
  useDeleteFriendMutation,
  useUpdateUserSettingsMutation,
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useValidateOTPMutation,
  useDisableOTPMutation,
  useCheckProfileCompletedMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} = usersApi;

export default usersApi;

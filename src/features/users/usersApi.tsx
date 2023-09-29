import { apiSlice } from "src/app/api/apiSlice";
import useSocket from "src/hooks/useSocket";
import { setCurrentUser } from "./usersSlice";

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getUsers: builder.query({
      query: () => "users",
      async onCacheEntryAdded(
        arg: any,
        { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any
      ) {
        const socket = useSocket();
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
      query: (username: string) => `users?username=${username}`,
    }),
    getUserByEmail: builder.query({
      query: (email: string) => `users?email=${email}`,
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // const users = result?.data;
          // if (users?.length === 0) {
          //   throw new Error("user not found");
          // }
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    getCurrentUser: builder.query({
      query: (currentUserId) => `users/${currentUserId}`,
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          await dispatch(setCurrentUser(result.data));
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
    }),
    getFriends: builder.query({
      query: (id: number) => `users/${id}/friends`,
    }),
    addFriend: builder.mutation({
      query: ({ currentUserId, friendId }) => ({
        url: `users/${currentUserId}/friends`,
        method: "POST",
        body: { friendId },
      }),
    }),
    deleteFriend: builder.mutation({
      query: ({ currentUserId, friendId }) => ({
        url: `users/${currentUserId}/friends/${friendId}`,
        method: "DELETE",
      }),
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
    }),
    validateOTP: builder.mutation({
      query: ({ userId, userPin }) => ({
        url: `otp-validate`,
        method: "POST",
        body: { userId, userPin },
      }),
    }),
    disableOTP: builder.mutation({
      query: (userId) => ({
        url: `otp-disable`,
        method: "POST",
        body: { userId },
      }),
    }),
    checkProfileCompleted: builder.mutation({
      query: (userId) => ({
        url: `profile-check-completed`,
        method: "POST",
        body: { userId },
      }),
    }),
    blockUser: builder.mutation({
      query: ({ id, blockedUserId }) => ({
        url: `users/${id}/blockuser`,
        method: "PATCH",
        body: { blockedUserId },
      }),
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
} = usersApi;

export default usersApi;

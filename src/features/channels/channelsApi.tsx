import { apiSlice } from "src/app/api/apiSlice";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import useSocket from "src/hooks/useSocket";

const channelsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllChannels: builder.query({
      query: () => `/channels`,
    }),
    // getSingleChannelById: builder.query({
    //   query: (id) => `/channels/${id}`,
    // }),
    getSingleChannelByName: builder.query({
      query: (name) => `/channels?name=${name}`,
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {
        const socket = useSocket();
        try {
          await cacheDataLoaded;
          socket.on("channel", (data) => {
            console.log("incoming channel: ", data);
            const isDataBelongToThisUser = data.data.members.find(
              (id) => id === getState()?.user?.currentUser?.id
            );
            if (isDataBelongToThisUser) {
              console.log("in1111");

              updateCachedData((draft) => {
                const channel = draft?.find((c) => c.id === data?.data?.id);
                // if (!channel?.id) {
                console.log("in222");

                draft?.unshift(data?.data);
                // }
              });
            }
          });
        } catch (error) {
          console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    getChannelsByMemberId: builder.query({
      query: (currentUserId) => `/channels/members/${currentUserId}`,
      async onCacheEntryAdded(
        arg,
        { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = useSocket();
        try {
          await cacheDataLoaded;
          socket.on("channel", (data) => {
            const isDataBelongToThisUser = data.data.members.find(
              (id) => id === arg
            );
            if (isDataBelongToThisUser) {
              updateCachedData((draft) => {
                const channel = draft?.find((c) => c.id === data?.data?.id);
                if (!channel?.id) {
                  draft?.unshift(data?.data);
                }
              });
            }
          });
        } catch (error) {
          console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    createChannel: builder.mutation({
      query: (data) => ({
        url: `/channels`,
        method: "POST",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // optimistic update
        const channelId = arg.id;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsByMemberId",
            getState()?.user.currentUser?.id,
            (draft) => {
              console.log("draft: ", draft);
              const channel = draft?.find((c) => c.id === channelId);
              if (channel?.id) {
                console.log("channel already exist in the cache: ", channel);
              } else {
                console.log("channel not in the cache, inserting it ");
                draft?.unshift(arg); // arg = channel data
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    updateChannel: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `/channels/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
    }),
    editChannelInfo: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `/channels/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const channelId = arg.id;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.data?.name,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft[index].name = arg?.data?.name;
                draft[index].description = arg?.data?.description;
                draft[index].privacy = arg?.data?.privacy;
                draft[index].password = arg?.data?.password;
              }
            }
          )
        );

        const patchResult2 = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsByMemberId",
            getState()?.user.currentUser?.id,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft[index].name = arg?.data?.name;
                draft[index].description = arg?.data?.description;
                draft[index].privacy = arg?.data?.privacy;
                draft[index].password = arg?.data?.password;
              }
            }
          )
        );

        try {
          const result = await queryFulfilled;

          console.log("result: ", result);
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
          patchResult2.undo();
        }
      },
    }),
    checkChannelPassword: builder.mutation({
      query: ({ id, password }: { id: number; password: string }) => ({
        url: `/channels/${id}`,
        method: "POST",
        body: { password },
      }),
    }),
    deleteChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const channelId = arg.id;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsByMemberId",
            getState()?.user.currentUser?.id,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft?.splice(index, 1);
              }
            }
          )
        );

        const patchResult2 = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.name,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft?.splice(index, 1);
              }
            }
          )
        );

        // TODO: invalidates the messages cache and remove the messages from the channel also in the db

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
          patchResult2.undo();
        }
      },
    }),
    removeUserFromChannel: builder.mutation({
      query: ({
        channelId,
        userId,
      }: {
        channelId: number;
        userId: number;
      }) => ({
        url: `/channels/${channelId}/members/${userId}`,
        method: "DELETE",
      }),
    }),
    LeaveChannel: builder.mutation({
      query: ({
        channelId,
        channelName,
        memberId,
      }: {
        channelId: number;
        memberId: number;
        channelName: string;
      }) => ({
        url: `channels/${channelId}/members/${memberId}/leave`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsByMemberId",
            getState()?.user.currentUser?.id,
            (draft) => {
              const channelIndex = draft?.findIndex((c) => c.id === channelId);
              if (channelIndex !== -1) {
                draft?.splice(channelIndex, 1);
              }
            }
          )
        );

        const patchResult2 = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft?.splice(index, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
          patchResult2.undo();
        }
      },
    }),
    // : {
    //   channelId: number;
    //   userId: number;
    //   channelName: string;
    // }
    muteChannelMember: builder.mutation({
      query: ({ channelId, userId, channelName }) => ({
        url: `/channels/${channelId}/members/${userId}/mute`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (index !== -1) {
                draft[index].mutedMembers.push(arg.userId);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    unmuteChannelMember: builder.mutation({
      query: ({ channelId, userId, channelName }) => ({
        url: `/channels/${channelId}/members/${userId}/unmute`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (index !== -1) {
                draft[index].mutedMembers = draft[index].mutedMembers.filter(
                  (id) => id !== arg.userId
                );
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    banChannelMember: builder.mutation({
      query: ({ channelId, userId }) => ({
        url: `channels/${channelId}/members/${userId}/ban`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (index !== -1) {
                draft[index].bannedMembers.push(arg.userId);
                const bannedMember = draft[index].members.find(
                  (member) => member?.id === arg.userId
                );
                if (bannedMember?.id) {
                  draft[index].members = draft[index].members.filter(
                    (member) => member?.id !== arg.userId
                  );
                }
                const bannedMemberIfAdmin = draft[index].admins.find(
                  (admin) => admin?.id === arg.userId
                );
                if (bannedMemberIfAdmin?.id) {
                  draft[index].admins = draft[index].admins.filter(
                    (admin) => admin?.id !== arg.userId
                  );
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    joinChannel: builder.mutation({
      query: ({ channelId, data }) => ({
        url: `channels/${channelId}/join`,
        method: "PATCH",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const channelId = arg.id;

        try {
          await queryFulfilled;
          await dispatch(
            channelsApi.util.prefetch(
              "getChannelsByMemberId",
              getState()?.user.currentUser?.id,
              {
                force: true,
              }
            )
          );
        } catch (error) {
          console.log("error: ", error);
          // patchResult.undo();
        }
      },
    }),
    kickChannelMember: builder.mutation({
      query: ({ channelId, memberId, channelName }) => ({
        url: `channels/${channelId}/members/${memberId}/kick`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const channelIndex = draft?.findIndex((c) => c.id === channelId);
              if (channelIndex !== -1) {
                const kickedMember = draft[channelIndex].members.find(
                  (m) => m?.id === arg.memberId
                );
                if (kickedMember?.id) {
                  draft[channelIndex].members = draft[
                    channelIndex
                  ].members.filter((m) => m?.id !== arg.memberId);
                }
                const kickedMemberIfAdmin = draft[channelIndex].admins.find(
                  (a) => a?.id === arg.memberId
                );
                if (kickedMemberIfAdmin?.id) {
                  draft[channelIndex].admins = draft[
                    channelIndex
                  ].admins.filter((a) => a?.id !== arg.memberId);
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAllChannelsQuery,
  // useGetSingleChannelByIdQuery,
  useGetSingleChannelByNameQuery,
  useGetChannelsByMemberIdQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useEditChannelInfoMutation,
  useCheckChannelPasswordMutation,
  useDeleteChannelMutation,
  useRemoveUserFromChannelMutation,
  useLeaveChannelMutation,
  useMuteChannelMemberMutation,
  useUnmuteChannelMemberMutation,
  useBanChannelMemberMutation,
  useJoinChannelMutation,
  useKickChannelMemberMutation,
} = channelsApi;

export default channelsApi;
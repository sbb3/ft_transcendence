import { apiSlice } from "src/app/api/apiSlice";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import useSocket from "src/hooks/useSocket";

const channelsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllChannels: builder.query({
      query: () => `/channels`,
    }),
    getSingleChannelById: builder.query({
      query: (id) => `/channels/${id}`,
    }),
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
              (id) => id === getState()?.auth?.user?.id
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
    getChannelsById: builder.query({
      query: (currentUserId) => `/channels?members_like=${currentUserId}`,
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
            "getChannelsById",
            getState()?.auth.user?.id,
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
    EditChannelInfo: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `/channels/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // // optimistic update
        console.log("arg: ", arg);
        const channelId = arg.id;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.data?.name,
            (draft) => {
              const channel = draft?.find((c) => c.id === channelId);
              draft?.unshift(arg?.data); // arg = channel data
            }
          )
        );

        const patchResult2 = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsById",
            getState()?.auth.user?.id,
            (draft) => {
              const channel = draft?.find((c) => c.id === channelId);
              draft?.unshift({ ...channel, ...arg?.data }); // arg = channel data
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
  }),
});

export const {
  useGetAllChannelsQuery,
  useGetSingleChannelByIdQuery,
  useGetSingleChannelByNameQuery,
  useGetChannelsByIdQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useEditChannelInfoMutation,
} = channelsApi;

export default channelsApi;

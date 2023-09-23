import { apiSlice } from "src/app/api/apiSlice";
import io from "socket.io-client";
import useSocket from "src/hooks/useSocket";

const channelMessagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getMessagesByChannelId: builder.query({
    //   query: (channelId) => `/channelMessages?channelId=${channelId}`,
    //   async onCacheEntryAdded(
    //     arg,
    //     { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
    //   ) {
    //     const currentUser = getState()?.user?.currentUser?.email;
    //     const socket = useSocket();

    //     try {
    //       await cacheDataLoaded;
    //       socket.on("channelMessages", (data) => {
    //         console.log("incoming channelMessages: ", data);
    //         // TODO: later
    //       });
    //     } catch (error) {
    //       console.log("error happened in getMessagesByChannelId : ", error);
    //       await cacheEntryRemoved;
    //       socket.disconnect();
    //     }
    //   },
    // }),
    getMessagesByChannelName: builder.query({
      query: (channelName) => `/channelMessages?channelName=${channelName}`,
      async onCacheEntryAdded(
        arg,
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const currentUser = getState()?.user?.currentUser;
        const socket = useSocket();

        try {
          await cacheDataLoaded;
          socket.on("channelMessages", (data) => {
            if (data?.data?.receivers.includes(currentUser?.id)) {
              updateCachedData((draft) => {
                const message = draft?.find((m) => m.id === data?.data?.id);
                if (!message?.id) draft?.push(data?.data);
              });
            }
          });
        } catch (error) {
          console.log("error happened in getMessagesByChannelId : ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    createChannelMessage: builder.mutation({
      query: (msgData) => ({
        url: `/channelMessages`,
        method: "POST",
        body: { ...msgData },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const message = arg;
        // const { channelId } = message;
        const { channelName } = message;
        // optimistic update
        const patchResultMsg = dispatch(
          channelMessagesApi?.util?.updateQueryData(
            "getMessagesByChannelName",
            channelName,
            (draft) => {
              draft?.push(message);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error happened in createChannelMessage : ", error);
          patchResultMsg.undo();
        }
      },
    }),
  }),
});

export const {
  // useGetMessagesByChannelIdQuery,
  useGetMessagesByChannelNameQuery,
  useCreateChannelMessageMutation,
} = channelMessagesApi;

export default channelMessagesApi;

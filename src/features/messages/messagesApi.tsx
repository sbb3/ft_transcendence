import { apiSlice } from "src/app/api/apiSlice";
import io from "socket.io-client";
import useSocket from "src/hooks/useSocket";

const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByConversationId: builder.query({
      query: (conversationId) => `/messages?conversationId=${conversationId}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // const socket = useSocket();
        const socket = io(import.meta.env.VITE_API_URL as string, {
          reconnectionDelay: 1000,
          reconnection: true,
          transports: ["websocket"],
          upgrade: false,
          rejectUnauthorized: false,
        });
        try {
          await cacheDataLoaded;
          socket.on("message", (data) => {
            console.log("data: ", data);
            updateCachedData((draft) => {
              // console.log("before updateCachedData draft: ", draft);
              const message = draft?.find((m) => m.id === data?.data?.id);
              if (message?.id) {
                // console.log("do nothing, ", message);
                console.log("message already exist in the cache: ", message);
              } else {
                // console.log("message not in the cache, inserting it ", message);
                draft?.push(data?.data);
              }
              // console.log("socket data: ", data?.data);
              // console.log("after updateCachedData draft?.data: ", draft);
            });
          });
        } catch (error) {
          console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    addMessage: builder.mutation({
      query: (body) => ({
        url: `/messages`,
        method: "POST",
        body
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // console.log("body: ", arg);
        // for optimistic updates, for me
        const messageData = arg;
        const { conversationId } = messageData;
        // console.log('messageData: ', messageData);
        // console.log("conversationId: ", conversationId);
        const patchResult = dispatch(
          messagesApi?.util?.updateQueryData(
            "getMessagesByConversationId",
            conversationId,
            (draft) => {
              console.log("updateQueryData: ", draft);
              draft?.push(messageData);
            }
          )
        );
        try {
          const result = await queryFulfilled;
          console.log("result: ", result);
          // const conversationId = arg?.conversationId;
          // dispatch(
          //   messagesApi.endpoints.getMessagesByConversationId.initiate(
          //     conversationId,
          //     {
          //       // subscribe: (result) => {
          //       //   console.log("result: ", result);
          //       // },
          //       forceRefetch: true,
          //     }
          //   )
          // );
        } catch (error) {
          console.log("error : ", error);
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetMessagesByConversationIdQuery, useAddMessageMutation } =
  messagesApi;

export default messagesApi;

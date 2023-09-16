import { apiSlice } from "src/app/api/apiSlice";
import io from "socket.io-client";
import useSocket from "src/hooks/useSocket";
import conversationApi from "../conversations/conversationsApi";

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
            // console.log("data: ", data);
            updateCachedData((draft) => {
              // console.log("before updateCachedData draft: ", draft);
              const message = draft?.find((m) => m.id === data?.data?.id);
              if (message?.id) {
                // console.log("do nothing, ", message);
                // console.log("message already exist in the cache: ", message);
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
      query: ({ msgData, conversationData }) => ({
        url: `/messages`,
        method: "POST",
        body: { ...msgData },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // console.log("body: ", arg);
        // for optimistic updates, for me
        const messageData = arg?.msgData;
        const { conversationId, content } = messageData;
        // console.log('messageData: ', messageData);
        // console.log("conversationId: ", conversationId);
        const patchResultMsg = dispatch(
          messagesApi?.util?.updateQueryData(
            "getMessagesByConversationId",
            conversationId,
            (draft) => {
              // console.log("updateQueryData: ", draft);
              draft?.push(messageData);
            }
          )
        );
        const patchResultCOnv = dispatch(
          conversationApi?.util?.updateQueryData(
            "getConversations",
            getState().auth.user?.email,
            (draft) => {
              console.log("conver draft", draft);
              // draft?.push(messageData);
              const conversation = draft?.find((c) => c.id === conversationId);
              if (conversation?.id) {
                conversation.lastMessageContent = content;
                draft = { ...draft, ...conversation };
              } else {
                // push to first conversation
                // draft?.unshift(con
              }
            }
          )
        );
        try {
          const result = await queryFulfilled;
          // console.log("result addMessage: ", result);
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
          dispatch(
            conversationApi.endpoints.updateConversation.initiate({
              id: conversationId,
              data: {
                lastMessageContent: content,
              },
            })
          );
        } catch (error) {
          console.log("error : ", error);
          patchResultMsg.undo();
          patchResultCOnv.undo();
        }
      },
    }),
  }),
});

export const { useGetMessagesByConversationIdQuery, useAddMessageMutation } =
  messagesApi;

export default messagesApi;

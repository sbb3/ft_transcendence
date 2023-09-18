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
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const currentUser = getState()?.auth?.user?.email;
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
            const sender = data.data.sender.email;
            const receiver = data.data.receiver.email;
            if (currentUser === sender || currentUser === receiver) {
              updateCachedData((draft) => {
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
            }
          });
        } catch (error) {
          console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    addMessage: builder.mutation({
      query: (msgData) => ({
        url: `/messages`,
        method: "POST",
        body: { ...msgData },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // console.log("body: ", arg);
        // for optimistic updates, for me
        const msgData = arg;
        const messageData = msgData;
        const { conversationId, content, lastMessageCreatedAt } = messageData;
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
              // console.log("conver draft", draft);
              // draft?.push(messageData);
              const conversation = draft?.find((c) => c.id === conversationId);
              if (conversation?.id) {
                conversation.lastMessageContent = content;
                conversation.lastMessageCreatedAt = lastMessageCreatedAt;
                draft = { ...draft, ...conversation };
              }
            }
          )
        );
        try {
          const result = await queryFulfilled;
          dispatch(
            conversationApi.endpoints.updateConversation.initiate({
              id: conversationId,
              data: {
                lastMessageContent: content,
                lastMessageCreatedAt: lastMessageCreatedAt,
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
    createMessage: builder.mutation({
      query: (msgData) => ({
        url: `/messages`,
        method: "POST",
        body: { ...msgData },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const messageData = arg;
        const { conversationId } = messageData;
        // optimistic update
        const patchResultMsg = dispatch(
          messagesApi?.util?.updateQueryData(
            "getMessagesByConversationId",
            conversationId,
            (draft) => {
              draft?.push(messageData);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error : ", error);
          patchResultMsg.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMessagesByConversationIdQuery,
  useAddMessageMutation,
  useCreateMessageMutation,
} = messagesApi;

export default messagesApi;

import { apiSlice } from "src/app/api/apiSlice";
import io from "socket.io-client";
import useSocket from "src/hooks/useSocket";
import conversationApi from "../conversations/conversationsApi";
import notificationsApi from "../notifications/notificationsApi";
import { v4 as uuidv4 } from "uuid";

const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByConversationId: builder.query({
      query: (conversationId) => `/messages?conversationId=${conversationId}`,
      async onCacheEntryAdded(
        arg,
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const currentUser = getState()?.user?.currentUser?.email;
        const socket = useSocket();

        try {
          await cacheDataLoaded;
          socket.on("message", (data) => {
            const sender = data.data.sender.email;
            const receiver = data.data.receiver.email;
            if (currentUser === sender || currentUser === receiver) {
              // console.log("incoming message: ", data);
              updateCachedData((draft) => {
                const message = draft?.find((m) => m.id === data?.data?.id);
                if (!message?.id) {
                  draft?.push(data?.data);
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
    addMessage: builder.mutation({
      query: (msgData) => ({
        url: `/messages`,
        method: "POST",
        body: { ...msgData },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const messageData = arg;
        const { conversationId, content, lastMessageCreatedAt } = messageData;
        const patchResultMsg = dispatch(
          messagesApi?.util?.updateQueryData(
            "getMessagesByConversationId",
            conversationId,
            (draft) => {
              draft?.push(messageData);
            }
          )
        );
        const patchResultCOnv = dispatch(
          conversationApi?.util?.updateQueryData(
            "getConversations",
            getState().user.currentUser?.email,
            (draft) => {
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
          await queryFulfilled;
          dispatch(
            conversationApi.endpoints.updateConversation.initiate({
              id: conversationId,
              data: {
                lastMessageContent: content,
                lastMessageCreatedAt: lastMessageCreatedAt,
              },
            })
          );
          dispatch(
            notificationsApi.endpoints.sendNotification.initiate({
              id: uuidv4(),
              conversationId: messageData.conversationId,
              type: "message",
              sender: {
                id: messageData.sender.id,
                email: messageData.sender.email,
                name: messageData.sender.name,
              },
              receiver: {
                id: messageData.receiver.id,
                email: messageData.receiver.email,
                name: messageData.receiver.name,
              },
              content: messageData.content,
              createdAt: messageData.lastMessageCreatedAt,
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

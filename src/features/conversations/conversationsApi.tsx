import { apiSlice } from "src/app/api/apiSlice";
import messagesApi from "../messages/messagesApi";
import io from "socket.io-client";
import useSocket from "src/hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import usersApi from "../users/usersApi";

interface Conversation {
  id: number;
  title: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (currentUserEmail) =>
        `/conversations?members_like=${currentUserEmail}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = useSocket();

        try {
          await cacheDataLoaded;
          socket.on("conversation", (data) => {
            updateCachedData((draft) => {
              console.log("before updateCachedData draft: ", draft);
              const conversation = draft?.find((c) => c.id === data?.data?.id);
              if (conversation?.id) {
                console.log("conversation: ", conversation);
              } else {
                console.log("do nothing conversation ", conversation);
                draft?.unshift(data?.data);
              }
              console.log("socket data: ", data?.data);
              console.log("after updateCachedData draft?.data: ", draft);
            });
          });
        } catch (error) {
          console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    getConversation: builder.query({
      query: (conversationId) => `/conversations?id=${conversationId}`,
    }),
    createConversation: builder.mutation({
      query: ({ conversation, receiver }) => ({
        url: `/conversations`,
        method: "POST",
        body: conversation,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // optimistic update, update the cache before the request is finished, so the user will see the result immediately9
        const conversation = arg.conversation;
        const receiver = arg.receiver;
        const currentUserEmail = conversation.members[0];
        const patchResult = dispatch(
          conversationApi?.util?.updateQueryData(
            "getConversations",
            currentUserEmail,
            (draft) => {
              draft?.unshift(conversation);
              console.log("updateQueryData: ", draft);
            }
          )
        );
        try {
          const result = await queryFulfilled;

          // const sender = arg.members[0];
          // dispatch(
          //   conversationApi?.endpoints?.getConversations.initiate(sender, {
          //     forceRefetch: true,
          //   })
          // );

          // const conversationId = arg?.conversationId;
          dispatch(
            messagesApi.endpoints.addMessage.initiate({
              id: uuidv4(),
              conversationId: arg?.conversation?.id,
              sender: {
                id: getState()?.auth?.user?.id,
                email: getState()?.auth?.user?.email,
                name: getState()?.auth?.user?.name,
              },
              receiver: {
                id: receiver?.id,
                email: receiver?.email,
                name: receiver?.name,
              },
              content: arg?.content,
            })
          );
        } catch (error) {
          console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useCreateConversationMutation,
} = conversationApi;

export default conversationApi;

// TODO:

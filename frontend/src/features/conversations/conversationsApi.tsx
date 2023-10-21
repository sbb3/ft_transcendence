import { apiSlice } from "src/app/api/apiSlice";
import messagesApi from "../messages/messagesApi";
import { createSocketClient } from "src/app/socket/client";
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
      query: (currentUserEmail) => `conversations?email=${currentUserEmail}`,
      async onCacheEntryAdded(
        arg,
        { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = createSocketClient();

        try {
          await cacheDataLoaded;
          socket.on("conversation", (data) => {
            const isDataBelongToThisUser = data.data.members.find(
              (email) => email === arg
            );
            if (isDataBelongToThisUser) {
              updateCachedData((draft) => {
                const conversation = draft?.find(
                  (c) => c.id === data?.data?.id
                );
                if (conversation?.id) {
                  conversation.lastMessageContent =
                    data?.data?.lastMessageContent;
                  conversation.lastMessageCreatedAt =
                    data?.data?.lastMessageCreatedAt;
                  draft = { ...draft, ...conversation };
                } else {
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
    getConversation: builder.query({
      query: (conversationId) =>
        `conversations/conversation?id=${conversationId}`,
      async onCacheEntryAdded(
        arg,
        { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = createSocketClient();

        try {
          await cacheDataLoaded;
          socket.on("conversation", (data) => {
            dispatch(
              conversationApi.util.prefetch("getConversation", data?.data?.id, {
                force: true,
              } as any)
            );
          });
        } catch (error) {
          console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    getConversationByMembersEmails: builder.query({
      query: ({ firstMemberEmail, secondMemberEmail }) =>
        `conversations/conversationByEmails?member1=${firstMemberEmail}&member2=${secondMemberEmail}`,
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error : ", error);
        }
      },
    }),
    createConversation: builder.mutation({
      query: (conversation) => ({
        url: `conversations`,
        method: "POST",
        body: {
          id: conversation.id,
          firstMember: conversation.firstMember,
          secondMember: conversation.secondMember,
          lastMessageContent: conversation.lastMessageContent,
          lastMessageCreatedAt: conversation.lastMessageCreatedAt,
        },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        const conversation = arg;
        const patchResult = dispatch(
          conversationApi?.util?.updateQueryData(
            "getConversations",
            getState()?.user?.currentUser?.email,
            (draft) => {
              draft?.unshift(conversation);
            }
          )
        );
        try {
          await queryFulfilled;

          const messageData = {
            id: uuidv4(),
            conversationId: conversation.id,
            sender: getState()?.user?.currentUser?.id,
            receiver: arg.secondMember,
            content: conversation.lastMessageContent,
            lastMessageCreatedAt: conversation.lastMessageCreatedAt,
          };
          await dispatch(
            messagesApi.endpoints.createMessage.initiate(messageData)
          );
        } catch (error) {
          console.log("error : ", error);
          patchResult.undo();
        }
      },
    }),
    createConversationWithoutMessage: builder.mutation({
      query: (conversation) => ({
        url: `/conversations`,
        method: "POST",
        body: { ...conversation },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        const conversation = arg;
        const patchResult = dispatch(
          conversationApi?.util?.updateQueryData(
            "getConversations",
            getState()?.user?.currentUser?.email,
            (draft) => {
              draft?.unshift(conversation);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error : ", error);
          patchResult.undo();
        }
      },
    }),
    updateConversation: builder.mutation({
      query: (data = {} as { id: number; message: any }) => ({
        url: `conversations`,
        method: "PATCH",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // optimistic update
        // const patchResult = dispatch(
        //   conversationApi?.util?.updateQueryData(
        //     "getConversations",
        //     getState().user.currentUser?.email,
        //     (draft) => {
        //       console.log("arg: ", arg);
        //       console.log("updateQueryData arg: ", draft);
        //       // draft = { ...draft, ...arg.data };
        //     }
        //   )
        // );
        // console.log("arg2: ", arg);

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
          // patchResult.undo();
        }
      },
    }),
    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: `conversations/${conversationId}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        // optimistic update
        const patchResult = dispatch(
          conversationApi?.util?.updateQueryData(
            "getConversations",
            getState().user.currentUser?.email,
            (draft) => {
              // indexOf or findIndex
              const index = draft?.findIndex((c) => c.id === arg.toString());
              if (index !== -1) {
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
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useCreateConversationMutation,
  useGetConversationByMembersEmailsQuery,
  useUpdateConversationMutation,
  useDeleteConversationMutation,
  useCreateConversationWithoutMessageMutation,
} = conversationApi;

export default conversationApi;

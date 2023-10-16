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
      query: (currentUserEmail) => `/conversations?email=${currentUserEmail}`,
      async onCacheEntryAdded(
        arg,
        { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = createSocketClient();

        try {
          await cacheDataLoaded;
          socket.on("conversation", (data) => {
            // TODO: this delete functionality will be removed later, replace it with another socket event for deleting the conversation, or
            // backend will check if the conversation exists when adding a message, else, throw an error
            if (data.data?.type === "delete") {
              updateCachedData((draft) => {
                const conversation = draft?.find(
                  (c) => c.id === data?.data?.id
                );
                if (conversation?.id) {
                  const index = draft?.findIndex(
                    (c) => c.id === data?.data?.id
                  );
                  if (index !== -1) {
                    draft?.splice(index, 1);
                  }
                  // TODO: later, delete the messages of the conversation also
                  dispatch(
                    conversationApi.endpoints.getConversation.initiate(
                      conversation.id
                    )
                  );
                }
              });
            } else {
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
      query: (membersEmails: string[]) =>
        `/conversations/conversationByEmails?member1=${membersEmails[0]}&member2=${membersEmails[1]}`,
    }),
    createConversation: builder.mutation({
      query: ({ conversation, receiver }) => ({
        url: `conversations`,
        method: "POST",
        body: { ...conversation },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        const conversation = arg.conversation;
        const receiver = arg.receiver;
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
            sender: {
              id: getState()?.user?.currentUser?.id,
              email: getState()?.user?.currentUser?.email,
              name: getState()?.user?.currentUser?.name,
            },
            receiver: {
              id: receiver.id,
              email: receiver.email,
              name: receiver.name,
            },
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
        body: conversation,
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
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `conversations/${id}`,
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
      query: ({ id, members }) => ({
        url: `conversations/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        // optimistic update
        console.log("arg: ", arg);
        const patchResult = dispatch(
          conversationApi?.util?.updateQueryData(
            "getConversations",
            getState().user.currentUser?.email,
            (draft) => {
              // indexOf or findIndex
              const index = draft?.findIndex((c) => c.id === arg.id.toString());
              if (index !== -1) {
                draft?.splice(index, 1);
              }
            }
          )
        );

        // TODO: delete the messages of the conversation also and invalidates the messages cache
        // TODO: initiate new request to get the conversations again
        try {
          await queryFulfilled;
          console.log("deleted");
          conversationApi.endpoints.getConversations.initiate(
            getState()?.user?.currentUser?.email
          );

          conversationApi.endpoints.getConversationByMembersEmails.initiate(
            arg.members
          );

          conversationApi.endpoints.getConversation.initiate(arg.id);
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

import { apiSlice } from "src/app/api/apiSlice";
import io from "socket.io-client";

const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `notification`,
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
        const socket = io(import.meta.env.VITE_SERVER_SOCKET_URL as string, {
          transports: ["websocket"],
          reconnection: false,
          // reconnection: true,
          // reconnectionAttempts: 10,
          // reconnectionDelay: 1000,
          // upgrade: false,
          // rejectUnauthorized: false,
        });

        try {
          await cacheDataLoaded;
          console.log("cacheDataLoaded");
          socket.on("notification", (data) => {
            const currentUserId = getState()?.user?.currentUser?.id;
            // console.log("location pathname: ", location);
            // console.log("currentUserId: ", currentUserId);
            // console.log("incoming notification: ", data);
            const senderId = data.data.sender.id;
            const receiverId = data.data.receiver.id;
            // console.log("senderId: ", senderId);
            // console.log("receiverId: ", receiverId);
            if (currentUserId !== senderId && currentUserId === receiverId) {
              // console.log("current user is receiver");
              updateCachedData((draft) => {
                const notification = draft?.find(
                  (n) => n.id === data?.data?.id
                );
                console.log("notification: ", notification);

                if (data?.data?.type === "message") {
                  if (
                    !notification?.id &&
                    getState()?.conversations?.conversationsId !==
                      data?.data?.conversationId
                  ) {
                    // console.log("msg notification added to cache");
                    draft?.unshift(data?.data);
                  } else {
                    // console.log("msg notification not added to cache, deleted");
                    dispatch(
                      notificationsApi?.endpoints?.deleteNotification?.initiate(
                        data?.data?.id
                      )
                    );
                  }
                } else if (
                  data?.data?.type === "friendRequest" ||
                  data?.data?.type === "gameRequest"
                ) {
                  if (!notification?.id) {
                    // console.log("friend or game notification added to cache");
                    draft?.unshift(data?.data);
                  }
                }
              });
            }
          });
        } catch (error) {
          console.log("error getNotifications endpoint: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    sendNotification: builder.mutation({
      query: (data) => ({
        url: `notification`,
        method: "POST",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // console.log("body: ", arg);
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `notification/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        // optimistic update, delete from cache first
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("error: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useSendNotificationMutation,
  useDeleteNotificationMutation,
} = notificationsApi;

export default notificationsApi;

/*
{
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
            }
*/

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
        }: any
      ) {
        const socket = io(
          import.meta.env.VITE_SERVER_NOTIFICATION_SOCKET_URL as string,
          {
            transports: ["websocket"],
            reconnection: false,
            // reconnection: true,
            // reconnectionAttempts: 10,
            // reconnectionDelay: 1000,
            // upgrade: false,
            // rejectUnauthorized: false,
          }
        );

        try {
          await cacheDataLoaded;
          console.log("cacheDataLoaded");
          socket.on("notification", (data) => {
            console.log("notification received: ", data);
            const currentUserId = getState()?.user?.currentUser?.id;
            const senderId = data.data.sender.id;
            const receiverId = data.data.receiverId;
            if (currentUserId !== senderId && currentUserId === receiverId) {
              updateCachedData((draft) => {
                const notification = draft?.find(
                  (n) => n.id === data?.data?.id
                );
                if (data?.data?.type === "message") {
                  if (
                    !notification?.id &&
                    getState()?.conversations?.conversationsId !==
                      data?.data?.conversationId
                  ) {
                    console.log("msg notification added to cache");
                    draft?.unshift(data?.data);
                  } else {
                    console.log("msg notification not added to cache, deleted");
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

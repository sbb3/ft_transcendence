import { apiSlice } from "src/app/api/apiSlice";
import io from "socket.io-client";
import useSocket from "src/hooks/useSocket";
import { useLocation } from "react-router-dom";

const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `/notifications`,
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
        const currentUserId = getState()?.user?.currentUser?.id;
        const socket = useSocket();
        // const location = useLocation();

        try {
          await cacheDataLoaded;
          console.log("cacheDataLoaded");
          //   TODO: change message to notification, then check its type, either message, friend request, or game request
          socket.on("notification", (data) => {
            // console.log("location pathname: ", location);
            // console.log("incoming notification: ", data);
            const sender = data.data.sender.id;
            const receiver = data.data.receiver.id;
            if (currentUserId !== sender && currentUserId === receiver) {
              updateCachedData((draft) => {
                const notification = draft?.find(
                  (n) => n.id === data?.data?.id
                );
                if (
                  !notification?.id &&
                  getState()?.conversations.conversationsId !==
                    data?.data?.conversationId
                ) {
                  console.log("notification added to cache");
                  draft?.unshift(data?.data);
                } else {
                  console.log("notification not added to cache, deleted");
                  dispatch(
                    notificationsApi?.endpoints?.deleteNotification?.initiate(
                      data?.data?.id
                    )
                  );
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
        url: `/notifications`,
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
        url: `/notifications/${id}`,
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

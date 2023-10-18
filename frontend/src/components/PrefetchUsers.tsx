import store from "src/app/store";
import { Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "src/features/users/usersApi";
import Loader from "./Utils/Loader";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setOnlineUsers } from "src/features/users/usersSlice";

const PrefetchUsers = () => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const {
    isLoading: isLoadingCurrentUser,
    isUninitialized,
    isFetching,
  } = useGetCurrentUserQuery(store.getState().auth.userId, {
    skip,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_USER_SOCKET_URL as string, {
      transports: ["websocket"],
      reconnection: false,
      query: {
        userId: currentUser?.id,
      },
    });
    socket.on("connect", () => {
      // dispatch(
      console.log(`user ${currentUser?.name} got connected`);
      socket.on("disconnect", () => {
        console.log(`user ${currentUser?.name} got disconnected`);
      });
      socket.on("onlineUsers", (data) => {
        setSkip(false);
        dispatch(setOnlineUsers(data?.data));
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return isLoadingCurrentUser || isUninitialized || isFetching ? (
    <Loader />
  ) : (
    <Outlet />
  );
};

export default PrefetchUsers;

import store from "src/app/store";
import { Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "src/features/users/usersApi";
import Loader from "./Utils/Loader";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOnlineUsers } from "src/features/users/usersSlice";
import { createSocketClient } from "src/app/socket/client";

const PrefetchUsers = () => {
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
    const socket = createSocketClient({
      api_url: import.meta.env.VITE_SERVER_USER_SOCKET_URL as string,
    });
    socket.on("connect", () => {
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

import store from "src/app/store";
import { Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "src/features/users/usersApi";
import Loader from "./Utils/Loader";

const PrefetchUsers = () => {
  const {
    isLoading: isLoadingCurrentUser,
    isUninitialized,
    isFetching,
  } = useGetCurrentUserQuery(store.getState().auth.userId, {
    refetchOnMountOrArgChange: true,
  });

  return isLoadingCurrentUser || isUninitialized || isFetching ? (
    <Loader />
  ) : (
    <Outlet />
  );
};

export default PrefetchUsers;

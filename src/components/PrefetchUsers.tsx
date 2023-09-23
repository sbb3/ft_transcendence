import { useEffect } from "react";
import store from "src/app/store";
import { Outlet } from "react-router-dom";
import usersApi from "src/features/users/usersApi";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "src/features/users/usersApi";
import { setCurrentUser } from "src/features/users/usersSlice";
import Loader from "./Utils/Loader";

const PrefetchUsers = () => {
  //   useEffect(() => {
  //     store.dispatch(
  //       usersApi.util.prefetch("getCurrentUser", store.getState().auth.userId, {
  //         force: true,
  //       } as any)
  //     );
  //   }, []);
  const {
    data: currentUser,
    isLoading: isLoadingCurrentUser,
    isUninitialized,
    isFetching,
  } = useGetCurrentUserQuery(store.getState().auth.userId, {
    refetchOnMountOrArgChange: true,
  });
  console.log(`prefetch currentUser:`);

  // store.dispatch(setCurrentUser(currentUser));

  return isLoadingCurrentUser || isUninitialized || isFetching ? (
    <Loader />
  ) : (
    <Outlet />
  );
};

export default PrefetchUsers;

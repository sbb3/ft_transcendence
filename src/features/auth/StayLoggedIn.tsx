import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useGetNewAccessTokenMutation } from "./authApi";
import Loader from "src/components/Utils/Loader";

const StayLoggedIn = () => {
  const accessToken = useSelector((state: any) => state.auth.accessToken);
  const [
    getNewAccessToken,
    { isLoading, isUninitialized, isError, isSuccess },
  ] = useGetNewAccessTokenMutation();

  useEffect(() => {
    // console.log(`useEffect: `);
    const getNewAccessTokenAsync = async () => {
      try {
        await getNewAccessToken({}).unwrap();
      } catch (err: any) {
        console.log(`err: `, err);
        return;
      }
    };

    if (!accessToken) {
      getNewAccessTokenAsync();
    }
  }, []);

  if ((isLoading || isUninitialized) && !accessToken) return <Loader />;

  if (isError) return <Outlet />;

  if (isSuccess || accessToken) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default StayLoggedIn;

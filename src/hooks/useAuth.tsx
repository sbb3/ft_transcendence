import { useSelector } from "react-redux";

const useAuth = () => {
  const accessToken = useSelector((state: any) => state.auth.accessToken);
  //   console.log(`accessToken: ${accessToken}`);
  return !!accessToken;
};

export default useAuth;

// import { useSelector } from "react-redux";

// const useAuth = () => {
//   const accessToken = useSelector((state: any) => state.auth.accessToken);
//   //   console.log(`accessToken: ${accessToken}`);
//   return !!accessToken;
// };

// export default useAuth;

import { useSelector } from "react-redux";

export default function useAuth() {
  const auth = useSelector((state: any) => state.auth);
  if (auth?.accessToken && auth?.userId) {
    return true;
  } else {
    return false;
  }
}

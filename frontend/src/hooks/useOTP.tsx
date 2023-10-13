import { useSelector } from "react-redux";

export default function useOTP() {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  return currentUser?.otp_enabled && !currentUser?.otp_validated ? true : false;
}

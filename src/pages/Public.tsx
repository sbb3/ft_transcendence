import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Public({ children }) {
  const isLoggedIn = useAuth();

  return !isLoggedIn ? children : <Navigate to="/" />;
}

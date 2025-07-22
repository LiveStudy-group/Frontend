import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if(!isLoggedIn) {
    return <Navigate to={'/login'} replace />
  }

  return <>{children}</>
}

export default PrivateRoute;
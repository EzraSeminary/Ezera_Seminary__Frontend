import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user && user.role === "Admin") {
    return <>{children}</>;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedAdminRoute;

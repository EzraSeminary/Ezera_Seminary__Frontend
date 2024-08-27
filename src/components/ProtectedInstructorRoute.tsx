import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ProtectedInstrcutorRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedInstrcutorRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user && user.role === "Instructor") {
    return <>{children}</>;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedAdminRoute;

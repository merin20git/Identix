import { Navigate } from "react-router-dom";
import { getRole, getToken } from "../services/api";

export default function ProtectedRoute({ allow, children }) {
  const token = getToken();
  if (!token) return <Navigate to="/" replace />;
  const role = getRole();
  if (allow && !allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}

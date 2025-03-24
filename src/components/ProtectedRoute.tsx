// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  // Chequear si hay un token en localStorage
  const token = localStorage.getItem("accessToken");
  // Si no hay token, redirigir a /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Dejar pasar
  return children;
}

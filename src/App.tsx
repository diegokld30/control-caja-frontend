import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CajaDiariaPage from "@/pages/cajaDiaria";
import CategoriaPage from "@/pages/categoria";
import DetalleCajaPage from "@/pages/detalleCaja";
import ProductoPage from "@/pages/producto";
import TransaccionesPage from "@/pages/transacciones";
import UsersPage from "@/pages/users";
import LoginPage from "@/pages/login";
import ProtectedRoute from "@/components/ProtectedRoute"
import { useUserMe } from "@/hooks/users/getUserMe";

function App() {
  const { data: userMe } = useUserMe();
  return (

    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<ProtectedRoute><IndexPage /></ProtectedRoute>} path="/" />
      <Route element={<ProtectedRoute><TransaccionesPage /></ProtectedRoute>} path="/transacciones" />
      <Route element={<ProtectedRoute><CajaDiariaPage /></ProtectedRoute>} path="/cajaDiaria" />
      {userMe?.rol === "administrador" ? (
        <Route element={<ProtectedRoute><DetalleCajaPage /></ProtectedRoute>} path="/detalleCaja" />
      ) : null}
      <Route element={<ProtectedRoute><CategoriaPage /></ProtectedRoute>} path="/categoria" />
      <Route element={<ProtectedRoute><ProductoPage /></ProtectedRoute>} path="/producto" />
      <Route element={<ProtectedRoute><UsersPage /></ProtectedRoute>} path="/users" />
    </Routes>
  );

}
export default App;

import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CajaDiariaPage from "@/pages/cajaDiaria";
import CategoriaPage from "@/pages/categoria";
import DetalleCajaPage from "@/pages/detalleCaja";
import ProductoPage from "@/pages/producto";
import TransaccionesPage from "@/pages/transacciones";
import UsersPage from "@/pages/users";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CajaDiariaPage />} path="/cajaDiaria" />
      <Route element={<CategoriaPage />} path="/categoria" />
      <Route element={<DetalleCajaPage />} path="/detalleCaja" />
      <Route element={<ProductoPage />} path="/producto" />
      <Route element={<TransaccionesPage />} path="/transacciones" />
      <Route element={<UsersPage />} path="/users" />
    </Routes>
  );

}
export default App;

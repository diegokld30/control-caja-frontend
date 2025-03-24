// src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@heroui/react";
import { login } from "@/api/auth/token"; // tu función que hace POST /api/auth/token/

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handleLogin() {
    try {
      const { access, refresh } = await login({ username, password });
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      navigate("/"); // o a la ruta que quieras
    } catch (err) {
      console.error("Error login:", err);
      // Muestra un toast de error o un mensaje
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold">Iniciar Sesión</h1>
      <Input label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button color="primary" onPress={handleLogin}>
        Entrar
      </Button>
    </div>
  );
}

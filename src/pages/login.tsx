// src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Image,
  Input,
  Button,
  addToast,
  Spinner,
} from "@heroui/react";
import { login } from "@/api/auth/token";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const { access, refresh } = await login({ username, password });
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      addToast({
        title: "Bienvenido",
        description: "Has iniciado sesión exitosamente",
        color: "success",
      });

      navigate("/");
    } catch (err) {
      console.error("Error login:", err);
      addToast({
        title: "Error de acceso",
        description: "Usuario o contraseña inválidos",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-200 to-orange-800 p-4">
      {/* Fondo con overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <Card
        isBlurred
        className="z-10 w-full max-w-3xl border-none bg-background/60 dark:bg-default-100/50 shadow-xl animate-fadeIn"
      >
        <CardBody className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
          {/* Imagen (lado izquierdo en pantallas md) */}
          <div className="relative hidden md:block md:col-span-5">
            <Image
              removeWrapper
              alt="Relaxing app background"
              className="w-full h-full object-cover"
              src="https://heroui.com/images/card-example-3.jpeg"
              // src="https://heroui.com/images/card-example-5.jpeg"
              // src="./carrito.svg"
            />
          </div>

          {/* Formulario (lado derecho) */}
          <div className="col-span-1 md:col-span-7 flex flex-col justify-center gap-5">
            <div>
              <h1 className="text-2xl font-bold text-foreground/90 mb-1">
                ¡Hola de nuevo!
              </h1>
              <p className="text-sm text-default-400">
                Por favor, ingresa tus credenciales para continuar
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Usuario"
                variant="bordered"
                isClearable
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                label="Contraseña"
                variant="bordered"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <Button
                disableRipple
                color="primary"
                className="relative overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-red-background/30 after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
                isDisabled={loading}
                size="lg"
                onPress={handleLogin}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Iniciando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
              <p className="text-center text-default-400 text-xs">
                ¿Olvidaste tu contraseña?{" "}
                <a href="#" className="text-primary hover:underline">
                  Recupérala
                </a>
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useUserMe } from "@/hooks/users/getUserMe";
import { useCajaDiaria } from "@/hooks/cajaDiaria/useCajaDiaria";
import { GetCajaDiaria } from "@/types/cajaDiaria/GetCajaDiaria";
// import { Button } from "@heroui/button";
import React from "react";
import { Spinner, Button, addToast } from "@heroui/react";

export default function IndexPage() {
  const [loading, setLoading] = React.useState(false);

  function handleLogout() {
    setLoading(true);
    try {
      // Limpia tokens del localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
  
      addToast({
        title: "Sesión finalizada",
        description: "Has cerrado sesión exitosamente",
        color: "success",
      });
  
      // Opcionalmente, redirige al usuario a la página de login
      window.location.href = "/login";  // ajusta según tu ruta de login
    } catch (error) {
      console.error("Error en cierre de sesión:", error);
      addToast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }
  
  // Consultas
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useUserMe();
  const {
    data: cajaData,
    error: cajaError,
    isLoading: cajaLoading,
  } = useCajaDiaria();

  if (userLoading || cajaLoading) {
    return (
      <DefaultLayout>
        <p className="text-xl text-center py-10">Cargando...</p>
      </DefaultLayout>
    );
  }
  if (userError || cajaError) {
    return (
      <DefaultLayout>
        <p className="text-xl text-center py-10">
          Error: {userError?.message || cajaError?.message}
        </p>
      </DefaultLayout>
    );
  }

  // Datos de usuario
  const firstName = userData?.first_name || "First name";
  const lastName = userData?.last_name || "Last name";

  // Seleccionar el registro con el mayor id (último insertado)
  const cajaToShow: GetCajaDiaria | null =
    cajaData && cajaData.length > 0
      ? cajaData.reduce((prev, current) =>
          (current as any).id > (prev as any).id ? current : prev
        )
      : null;

  // Extraer información de la caja a mostrar
  let abiertaPor = "Desconocido";
  if (cajaToShow && cajaToShow.abierta_por) {
    if (typeof cajaToShow.abierta_por === "object") {
      abiertaPor = `${cajaToShow.abierta_por.first_name} ${cajaToShow.abierta_por.last_name}`;
    } else {
      abiertaPor = `ID: ${cajaToShow.abierta_por}`;
    }
  }

  return (
    <DefaultLayout>
      <div className="bg-gray-100 py-6 rounded-lg border shadow-2xl">
        {/* Header */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={title({ size: "lg" })}>
                Bienvenido, {firstName} {lastName}
              </h1>
              <p className={subtitle({ class: "mt-2" })}>
                Controla y monitorea tu caja diaria en tiempo real.
              </p>
            </div>
            <Button
              disableRipple
              className="relative overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-violet-400 text-white after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
              isDisabled={loading}
              size="lg"
              onPress={handleLogout}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Cerrar sesión...
                </>
              ) : (
                "Cerrar sesión"
              )}
            </Button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tarjeta de Caja Diaria */}
            {cajaToShow && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className={title({ color: "violet", size: "lg" })}>
                  Caja Diaria
                </h2>
                <div className="mt-4 space-y-3">
                  <p className="text-gray-700">
                    <span className="font-bold">Observación:</span>{" "}
                    {cajaToShow.observaciones}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">Abierta por:</span> {abiertaPor}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">Saldo Inicial:</span>{" "}
                    {cajaToShow.saldo_inicial
                      ? `$${parseFloat(cajaToShow.saldo_inicial).toFixed(2)}`
                      : "No registrado"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">Saldo Final:</span>{" "}
                    {cajaToShow.saldo_final
                      ? `$${parseFloat(cajaToShow.saldo_final).toFixed(2)}`
                      : "No registrado"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">Fecha Apertura:</span>{" "}
                    {cajaToShow.fecha_apertura
                      ? new Date(cajaToShow.fecha_apertura).toLocaleString(
                          "es-ES"
                        )
                      : "No registrada"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">Fecha Cierre:</span>{" "}
                    {cajaToShow.fecha_cierre
                      ? new Date(cajaToShow.fecha_cierre).toLocaleString(
                          "es-ES"
                        )
                      : "No registrada"}
                  </p>
                </div>
              </div>
            )}

            {/* Tarjeta de Información Extra (Ejemplo de sugerencias) */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className={title({ color: "blue", size: "lg" })}>
                Sugerencias y Alertas
              </h2>
              <div className="mt-4">
                <p className="text-gray-700">
                  Revisa periódicamente el estado de la caja para evitar
                  discrepancias.
                </p>
                <p className="text-gray-700 mt-2">
                  Si encuentras algún error, comunícate con el soporte
                  inmediatamente.
                </p>
                <div className="mt-4">
                  <Snippet hideCopyButton hideSymbol variant="bordered">
                    <span>
                      Consulta la sección de{" "}
                      <Code color="primary">Caja Diaria</Code> para más
                      detalles.
                    </span>
                  </Snippet>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Dashboard Pro. Todos los derechos
          reservados.
        </footer>
      </div>
    </DefaultLayout>
  );
}

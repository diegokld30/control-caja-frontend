// src/pages/CajaDiariaPage.tsx
import React from "react";
import DefaultLayout from "@/layouts/default";
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";
import { GlobalModal } from "@/components/GlobalModal";
import { GlobalForm, FieldConfig } from "@/components/GlobalForm";

// Hooks
import { useCajaDiaria } from "@/hooks/cajaDiaria/getCajaDiaria";
import { useUsers } from "@/hooks/users/getUsers";

// Tipos
import { GetCajaDiaria } from "@/types/cajaDiaria/GetCajaDiaria";
import { postCajaDiaria } from "@/api/cajaDiaria/postCajaDiaria";

// Para invalidar la caché tras el POST
import { useQueryClient } from "@tanstack/react-query";

// Column definition
interface ColumnDef<T> {
  name: string;
  uid: keyof T;
  sortable?: boolean;
}

const columns: ColumnDef<GetCajaDiaria>[] = [
  { name: "Fecha Apertura", uid: "fecha_apertura", sortable: true },
  { name: "Fecha Cierre",   uid: "fecha_cierre",   sortable: true },
  { name: "Saldo Inicial",  uid: "saldo_inicial",  sortable: true },
  { name: "Saldo Final",    uid: "saldo_final",    sortable: true },
  { name: "Abierta Por",    uid: "abierta_por" },
  { name: "Cerrada Por",    uid: "cerrada_por" },
  { name: "Observaciones",  uid: "observaciones" },
];

// Helper para formatear fecha
function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

// Renderiza cada celda según la columna
function renderCell(item: any, columnKey: string) {
  const val = item[columnKey];

  // Formatear fecha_apertura / fecha_cierre
  if (
    (columnKey === "fecha_apertura" || columnKey === "fecha_cierre") &&
    typeof val === "string"
  ) {
    return formatDateTime(val);
  }

  // Mostrar nombre en "abierta_por" / "cerrada_por"
  if (
    (columnKey === "abierta_por" || columnKey === "cerrada_por") &&
    val &&
    typeof val === "object"
  ) {
    return `${val.first_name} ${val.last_name}`;
  }

  // Caso default
  return String(val ?? "");
}

export default function CajaDiariaPage() {
  // 1) Data de caja diaria (React Query)
  const { data, isLoading, isError, error } = useCajaDiaria();

  // 2) Data de usuarios (React Query)
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();

  // 3) Estado del modal
  const [isModalOpen, setModalOpen] = React.useState(false);

  // 4) Estado del formulario
  const [formValues, setFormValues] = React.useState({
    saldo_inicial: "",
    abierto_por: "",
    observaciones: "Abierta",
  });

  // 5) Convertimos usersData en un array para "heroSelect"
  const userItems =
    usersData?.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      // avatar: u.avatar, // si tu API no provee avatar
      email: u.email,     // si tu API no provee email, quita esto
    })) ?? [];

  // 6) Definir los campos de formulario (heroNumber, heroSelect, etc.)
  const formFields: FieldConfig[] = [
    {
      name: "saldo_inicial",
      label: "Saldo Inicial",
      type: "heroNumber",
    },
    {
      name: "abierto_por",
      label: "Abierto por",
      type: "heroSelect",
      items: userItems,
    },
    {
      name: "observaciones",
      label: "Observaciones",
      type: "text",
    },
  ];

  // Para refrescar la tabla tras POST
  const queryClient = useQueryClient();

  // 7) Mientras carga la data, mostramos un mensaje
  if (isLoading || usersLoading) {
    return <DefaultLayout>Cargando Caja Diaria.</DefaultLayout>;
  }
  if (isError || usersError) {
    return (
      <DefaultLayout>
        Error al cargar data: {String(error || usersError)}
      </DefaultLayout>
    );
  }

  // 8) Al presionar “Guardar” en el modal
  async function handleConfirm() {
    // console.log("Creando caja con:", formValues);

    try {
      // Preparamos el payload para tu API
      // Ajusta segun tu serializer
      const payload = {
        fecha_cierre: null, // si no lo manejas en creacion
        saldo_inicial: String(formValues.saldo_inicial), // parseFloat si deseas
        saldo_final: null,   // o null si no se maneja
        abierta_por: parseInt(formValues.abierto_por), // ID del user
        cerrada_por: null,     // si no se cierra aun
        observaciones: formValues.observaciones,
      };

      // Llamamos la funcion postCajaDiaria
      await postCajaDiaria(payload);

      // Cerramos el modal
      setModalOpen(false);

      // Refrescamos la tabla invalidando la cache
      queryClient.invalidateQueries(["cajaDiaria"]);
    } catch (err) {
      console.error("Error al crear caja:", err);
      // Manejar error (toast, alert, etc.)
    }
  }

  return (
    <DefaultLayout>
      <h1>Cajas Diarias</h1>

      {/* Tabla */}
      <AdvancedGlobalTable<GetCajaDiaria>
        title="Listado de Caja Diaria"
        data={data ?? []}
        columns={columns}
        renderCell={renderCell}
        onAddNew={() => {
          // reset form
          setFormValues({
            saldo_inicial: "",
            abierto_por: "",
            observaciones: "",
          });
          setModalOpen(true);
        }}
      />

      {/* Modal + Formulario */}
      <GlobalModal
        title="Registrar Nueva Caja"
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        confirmLabel="Guardar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirm}
      >
        <GlobalForm
          fields={formFields}
          values={formValues}
          onChange={setFormValues}
        />
      </GlobalModal>
    </DefaultLayout>
  );
}

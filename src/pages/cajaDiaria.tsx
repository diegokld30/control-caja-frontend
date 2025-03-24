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
  // 1) Data de caja diaria
  const { data, isLoading, isError, error } = useCajaDiaria();

  // 2) Data de usuarios
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
    observaciones: "",
  });

  // 5) Convertimos usersData en un array para "heroSelect"
  //    Cada item => { id, name, avatar, email }
  const userItems =
    usersData?.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      // avatar: u.avatar, // si tu API no provee avatar, quita esto
      email: u.email,   // si tu API no provee email, quita esto
    })) ?? [];

  // 6) Definir los campos de formulario, usando "heroNumber" y "heroSelect"
  //    => ver GlobalForm.tsx con el switch/case para estos types
  const formFields: FieldConfig[] = [
    {
      name: "saldo_inicial",
      label: "Saldo Inicial",
      type: "heroNumber", // Renderizará <NumberInput> de Hero UI
    },
    {
      name: "abierto_por",
      label: "Abierto por",
      type: "heroSelect", // Renderizará <Select> de Hero UI con avatares
      items: userItems,
    },
    {
      name: "observaciones",
      label: "Observaciones",
      type: "text", // Renderizará <Input type="text" />
    },
  ];

  // 7) Mientras carga la data, mostramos un mensaje
  if (isLoading || usersLoading) {
    return <DefaultLayout>Cargando Caja Diaria y Usuarios...</DefaultLayout>;
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
    console.log("Creando caja con:", formValues);
    // Ejemplo de post:
    // await axios.post("http://127.0.0.1:8000/api/cajadiaria/", {
    //   saldo_inicial: formValues.saldo_inicial, // si "heroNumber" retorna string, haz parseFloat
    //   abierta_por: parseInt(formValues.abierto_por), // ID del user
    //   observaciones: formValues.observaciones,
    // });
    setModalOpen(false);
  }

  return (
    <DefaultLayout>
      <h1>Cajas Diarias</h1>

      {/* La tabla */}
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
            observaciones: "Abierta",
          });
          setModalOpen(true);
        }}
      />

      {/* El modal con el formulario */}
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

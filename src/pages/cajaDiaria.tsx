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

// React Query
import { useQueryClient } from "@tanstack/react-query";

// Hero UI toasts
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { VerticalDotsIcon } from "@/components/icons";

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
  { name: "Acciones",  uid: "acciones" },
];

// Helper para formatear fecha
function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

// Render de celdas
// 1) Define la columna "acciones"


// 2) Ajusta `renderCell` para manejar la columna de acciones
function renderCell(item: any, columnKey: string) {
  if (columnKey === "acciones") {
    return (
      <div className="relative flex justify-end items-center gap-2">
        <Dropdown className="bg-background border-1 border-default-200">
          <DropdownTrigger>
            <Button isIconOnly radius="full" size="sm" variant="light">
              <VerticalDotsIcon className="text-default-400" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="view" onPress={() => handleView(item)}>
              View
            </DropdownItem>
            <DropdownItem key="edit" onPress={() => handleEdit(item)}>
              Edit
            </DropdownItem>
            <DropdownItem key="delete" onPress={() => handleDelete(item)}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

  // Resto de tu lógica para otras columnas (fechas, usuarios, etc.)
  const val = item[columnKey];
  if (
    (columnKey === "fecha_apertura" || columnKey === "fecha_cierre") &&
    typeof val === "string"
  ) {
    return formatDateTime(val);
  }
  if (
    (columnKey === "abierta_por" || columnKey === "cerrada_por") &&
    val &&
    typeof val === "object"
  ) {
    return `${val.first_name} ${val.last_name}`;
  }
  return String(val ?? "");
}

// 3) Define las funciones
function handleView(item: GetCajaDiaria) {
  console.log("View item:", item);
  // Lógica de vista detallada
}

function handleEdit(item: GetCajaDiaria) {
  console.log("Edit item:", item);
  // Lógica de edición
}

function handleDelete(item: GetCajaDiaria) {
  console.log("Delete item:", item);
  // Lógica de borrado
}

export default function CajaDiariaPage() {
  function handleFormChange(newValues: Record<string, any>) {
    // Queremos combinarlo con el estado anterior
    setFormValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }
  // Data de caja
  const { data, isLoading, isError, error } = useCajaDiaria();
  // Data de usuarios
  const { data: usersData, isLoading: usersLoading, isError: usersError } = useUsers();

  // Estado del modal
  const [isModalOpen, setModalOpen] = React.useState(false);

  // Estado del formulario
  const [formValues, setFormValues] = React.useState({
    saldo_inicial: "",
    abierto_por: "",
    observaciones: "",
  });

  // Mapeo de usuarios para heroSelect
  const userItems =
    usersData?.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      email: u.email,
    })) ?? [];

  // Campos del formulario
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

  // Para refrescar la tabla
  const queryClient = useQueryClient();

  // Mientras carga
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

  // Crear nueva caja
  async function handleConfirm() {
    try {
      const payload = {
        fecha_cierre: null,
        saldo_inicial: String(formValues.saldo_inicial),
        saldo_final: null,
        abierta_por: parseInt(formValues.abierto_por),
        cerrada_por: null,
        observaciones: formValues.observaciones,
      };

      await postCajaDiaria(payload);

      // Cerrar modal
      setModalOpen(false);

      // Refrescar tabla
      queryClient.invalidateQueries({ queryKey:["cajaDiaria"]});

      // Toast éxito
      addToast({
        title: "Caja creada",
        description: "La caja se creó exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al crear caja:", err);

      // Toast error
      addToast({
        title: "Error",
        description: "No se pudo crear la caja.",
        color: "danger",
      });
    }
  }

  return (
    <DefaultLayout>
      

      <AdvancedGlobalTable<GetCajaDiaria>
        title="Historial de cajas"
        data={data ?? []}
        columns={columns}
        renderCell={renderCell}
        // Si se quieren dar valores por defecto se modifica esto.
        onAddNew={() => {
          setFormValues({
            saldo_inicial: "",
            abierto_por: "",
            observaciones: "Abierta",
          });
          setModalOpen(true);
        }}
      />

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
          onChange={handleFormChange}
        />
      </GlobalModal>
    </DefaultLayout>
  );
}

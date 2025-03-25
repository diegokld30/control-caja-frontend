// src/pages/CajaDiariaPage.tsx
import React from "react";
import DefaultLayout from "@/layouts/default";
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";
import { GlobalModal } from "@/components/GlobalModal";
import { GlobalForm, FieldConfig } from "@/components/GlobalForm";

import { useCajaDiaria } from "@/hooks/cajaDiaria/getCajaDiaria";
import { useUsers } from "@/hooks/users/getUsers";
import { useUserMe } from "@/hooks/users/getUserMe"; // <-- nuestro hook
import { GetCajaDiaria } from "@/types/cajaDiaria/GetCajaDiaria";
import { postCajaDiaria } from "@/api/cajaDiaria/postCajaDiaria";

import { useQueryClient } from "@tanstack/react-query";
import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { VerticalDotsIcon } from "@/components/icons";

interface ColumnDef<T> {
  name: string;
  uid: keyof T | "acciones";
  sortable?: boolean;
}

const columns: ColumnDef<GetCajaDiaria>[] = [
  { name: "Fecha Apertura", uid: "fecha_apertura", sortable: true },
  { name: "Fecha Cierre", uid: "fecha_cierre", sortable: true },
  { name: "Saldo Inicial", uid: "saldo_inicial", sortable: true },
  { name: "Saldo Final", uid: "saldo_final", sortable: true },
  { name: "Abierta Por", uid: "abierta_por" },
  { name: "Cerrada Por", uid: "cerrada_por" },
  { name: "Observaciones", uid: "observaciones" },
  { name: "Acciones", uid: "acciones" },
];

function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

export default function CajaDiariaPage() {
  const queryClient = useQueryClient();

  // 1) Obtenemos data de la caja
  const { data, isLoading, isError, error } = useCajaDiaria();

  // 2) Obtenemos data de los usuarios
  const { data: usersData, isLoading: usersLoading, isError: usersError } = useUsers();

  // 3) Obtenemos data del usuario logueado (para saber su rol)
  const {
    data: userMe,
    isLoading: userMeLoading,
    isError: userMeError,
  } = useUserMe();

  // 4) Estado del modal (nueva caja)
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    saldo_inicial: "",
    abierto_por: "",
    observaciones: "",
  });

  function handleFormChange(newValues: Record<string, any>) {
    setFormValues((prev) => ({ ...prev, ...newValues }));
  }

  // 5) Manejo de loading / error
  if (isLoading || usersLoading || userMeLoading) {
    return <DefaultLayout>Cargando Caja Diaria...</DefaultLayout>;
  }
  if (isError || usersError || userMeError) {
    return (
      <DefaultLayout>
        Error al cargar data: {String(error || usersError || userMeError)}
      </DefaultLayout>
    );
  }

  // 6) Funciones de acciones
  function handleView(item: GetCajaDiaria) {
    console.log("Ver detalles:", item);
  }
  function handleEdit(item: GetCajaDiaria) {
    console.log("Cerrar caja:", item);
  }
  function handleDelete(item: GetCajaDiaria) {
    console.log("Eliminar caja:", item);
    // Lógica de borrado
  }

  // 7) Definir renderCell adentro, para usar userMe?.rol
  const renderCell = (item: GetCajaDiaria, columnKey: string) => {
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
                Ver detalles
              </DropdownItem>

              {/* Condicional si el rol es "Administrador" */}
              {userMe?.rol === "administrador" ? (
                <DropdownItem key="edit" onPress={() => handleEdit(item)}>
                Cerrar caja
              </DropdownItem>
              ): null}

              {/* Condicional si el rol es "Administrador" */}
              
              {userMe?.rol === "administrador" ? (
                <DropdownItem key="delete" onPress={() => handleDelete(item)}>
                  Eliminar
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }
    console.log(userMe?.rol);

    // Fechas
    const val = item[columnKey as keyof GetCajaDiaria];
    if (
      (columnKey === "fecha_apertura" || columnKey === "fecha_cierre") &&
      typeof val === "string"
    ) {
      return formatDateTime(val);
    }
    // Abierta/Cerrada por
    if (
      (columnKey === "abierta_por" || columnKey === "cerrada_por") &&
      val &&
      typeof val === "object"
    ) {
      return `${val.first_name} ${val.last_name}`;
    }
    return String(val ?? "");
  };

  // 8) Mapeo de usuarios para heroSelect
  const userItems =
    usersData?.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      email: u.email,
    })) ?? [];

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

  // 9) Crear nueva caja
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
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cajaDiaria"] });

      addToast({
        title: "Caja creada",
        description: "La caja se creó exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al crear caja:", err);
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

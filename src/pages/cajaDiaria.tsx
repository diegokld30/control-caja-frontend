// src/pages/CajaDiariaPage.tsx
import React from "react";
import DefaultLayout from "@/layouts/default";
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";
import { GlobalModal } from "@/components/GlobalModal";
import { GlobalForm, FieldConfig } from "@/components/GlobalForm";

import { useCajaDiaria } from "@/hooks/cajaDiaria/getCajaDiaria";
import { useUsers } from "@/hooks/users/getUsers";
import { useUserMe } from "@/hooks/users/getUserMe";
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

// 1) Column definition
interface ColumnDef<T> {
  name: string;
  uid: keyof T | "acciones";
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
  { name: "Acciones",       uid: "acciones" },
];

// Helper para formatear fecha (aceptamos string | null)
function formatDateTime(isoString: string | null) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

export default function CajaDiariaPage() {
  const queryClient = useQueryClient();

  // 2) Data: cajas, usuarios, userMe
  const { data, isLoading, isError, error } = useCajaDiaria();
  const { data: usersData, isLoading: usersLoading, isError: usersError } = useUsers();
  const { data: userMe, isLoading: userMeLoading, isError: userMeError } = useUserMe();

  // 3) Modal para crear nueva caja
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    saldo_inicial: "",
    abierto_por: "",
    observaciones: "",
  });

  function handleFormChange(newValues: Record<string, any>) {
    setFormValues((prev) => ({ ...prev, ...newValues }));
  }

  // 4) Modal para ver detalles de una caja existente
  const [selectedCaja, setSelectedCaja] = React.useState<GetCajaDiaria | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);

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
    // console.log("Ver detalles:", item);
    setSelectedCaja(item);
    setDetailModalOpen(true);
  }

  function handleEdit(item: GetCajaDiaria) {
    console.log("Cerrar caja:", item);
    // Podrías abrir otro modal o reusar uno
  }

  function handleDelete(item: GetCajaDiaria) {
    console.log("Eliminar caja:", item);
    // Lógica de borrado
  }

  // 7) Mapeo de usuarios para heroSelect (cuando creas caja)
  const userItems =
    usersData?.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      email: u.email,
    })) ?? [];

  // Campos para el modal "Crear Nueva Caja"
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

  // 8) Crear nueva caja
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

  // 9) Definir renderCell para la tabla
  const renderCell = (item: any, columnKey: string) => {
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

              {userMe?.rol === "administrador" ? (
                <DropdownItem key="edit" onPress={() => handleEdit(item)}>
                  Cerrar caja
                </DropdownItem>
              ) : null}

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

    // Resto de columnas
    const val = item[columnKey];
    // Formatear fechas (pueden ser string | null)
    if (columnKey === "fecha_apertura" || columnKey === "fecha_cierre") {
      return formatDateTime(val as string | null);
    }

    // Abierta/Cerrada por (puede ser number | { first_name, last_name })
    if ((columnKey === "abierta_por" || columnKey === "cerrada_por") && val) {
      if (typeof val === "object") {
        return `${val.first_name} ${val.last_name}`;
      } else {
        // es un number
        return String(val);
      }
    }

    // Observaciones, etc.
    return String(val ?? "");
  };

  // 10) Campos y valores para modal "Ver Detalles"
  const detailFields: FieldConfig[] = [
    {
      name: "fecha_apertura",
      label: "Fecha Apertura",
      type: "text",
    },
    {
      name: "saldo_inicial",
      label: "Saldo Inicial",
      type: "text",
    },
    {
      name: "abierta_por",
      label: "Abierta por",
      type: "text",
    },
    {
      name: "observaciones",
      label: "Observaciones",
      type: "text",
    },
  ];

  // Convertimos la caja seleccionada en un object para el form
  const detailValues = selectedCaja
  ? {
      fecha_apertura: formatDateTime(selectedCaja.fecha_apertura ?? null),
      saldo_inicial: String(selectedCaja.saldo_inicial ?? ""),
      abierta_por:
        selectedCaja.abierta_por !== null && typeof selectedCaja.abierta_por === "object"
          ? `${selectedCaja.abierta_por.first_name} ${selectedCaja.abierta_por.last_name}`
          : String(selectedCaja.abierta_por ?? ""),
      observaciones: selectedCaja.observaciones ?? "",
    }
  : {};


  return (
    <DefaultLayout>
      {/* Tabla */}
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

      {/* Modal: Crear nueva caja */}
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

      {/* Modal: Ver detalles de caja */}
      <GlobalModal
        title="Detalles de la Caja"
        isOpen={isDetailModalOpen}
        onOpenChange={setDetailModalOpen}
        confirmLabel="Cerrar"
        cancelLabel="Cancelar"
        onConfirm={() => setDetailModalOpen(false)}
      >
        {selectedCaja && (
          <GlobalForm
            fields={detailFields}
            values={detailValues}
            onChange={() => {}}
          />
        )}
      </GlobalModal>
    </DefaultLayout>
  );
}

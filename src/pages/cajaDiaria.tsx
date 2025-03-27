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
import { updateCajaDiaria } from "@/api/cajaDiaria/putCajaDiaria"; // Función para actualizar
import { deleteCajaDiaria } from "@/api/cajaDiaria/deleteCajaDiaria"; // Función para eliminar

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

function formatDateTime(isoString: string | null) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function CajaDiariaPage() {
  const queryClient = useQueryClient();

  // Datos de la API
  const { data, isLoading, isError, error } = useCajaDiaria();
  const { data: usersData, isLoading: usersLoading, isError: usersError } = useUsers();
  const { data: userMe, isLoading: userMeLoading, isError: userMeError } = useUserMe();

  // Estado para creación
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    saldo_inicial: "",
    abierto_por: "",
    observaciones: "",
  });
  const handleFormChange = (newValues: Record<string, any>) =>
    setFormValues((prev) => ({ ...prev, ...newValues }));

  // Estado para ver detalles
  const [selectedCaja, setSelectedCaja] = React.useState<GetCajaDiaria | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);

 

  // Estado para eliminación
  const [itemToDelete, setItemToDelete] = React.useState<GetCajaDiaria | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);

  // Estado para cerrar caja (nueva funcionalidad)
  const [isCloseModalOpen, setCloseModalOpen] = React.useState(false);
  const [closeFormValues, setCloseFormValues] = React.useState({
    saldo_final: "",
    observaciones: "Cerrada",
  });
  const handleCloseFormChange = (newValues: Record<string, any>) =>
    setCloseFormValues((prev) => ({ ...prev, ...newValues }));

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

  // Funciones de acción
  const handleView = (item: GetCajaDiaria) => {
    setSelectedCaja(item);
    setDetailModalOpen(true);
  };

 

  const handleCloseCaja = (item: GetCajaDiaria) => {
    setSelectedCaja(item);
    setCloseFormValues({
      saldo_final: "",
      observaciones: "Cerrada",
    });
    setCloseModalOpen(true);
  };

  const handleDelete = (item: GetCajaDiaria) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // Función para confirmar cerrar caja
  const handleCloseConfirm = async () => {
    if (!selectedCaja || !userMe) return;
    try {
      const payload = {
        fecha_cierre: new Date().toISOString(),
        saldo_inicial: selectedCaja.saldo_inicial,
        saldo_final: String(closeFormValues.saldo_final),
        abierta_por:
          selectedCaja.abierta_por != null && typeof selectedCaja.abierta_por === "object"
            ? Number((selectedCaja.abierta_por as any).id)
            : Number(selectedCaja.abierta_por),
        // Aseguramos que se asigne el id numérico del usuario logueado
        cerrada_por: Number(userMe.id),
        observaciones: closeFormValues.observaciones,
      };
      await updateCajaDiaria(selectedCaja.id, payload);
      setCloseModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cajaDiaria"] });
      addToast({
        title: "Caja cerrada",
        description: "La caja se cerró exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al cerrar la caja:", err);
      addToast({
        title: "Error",
        description: "No se pudo cerrar la caja.",
        color: "danger",
      });
    }
  };

  // Función para confirmar eliminación
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      const payload = {
        fecha_cierre: itemToDelete.fecha_cierre,
        saldo_inicial: itemToDelete.saldo_inicial,
        saldo_final: itemToDelete.saldo_final,
        abierta_por:
          itemToDelete.abierta_por != null && typeof itemToDelete.abierta_por === "object"
            ? Number((itemToDelete.abierta_por as any).id)
            : Number(itemToDelete.abierta_por),
        // Para cerrada_por, se convierte de manera similar
        cerrada_por:
          itemToDelete.cerrada_por != null && typeof itemToDelete.cerrada_por === "object"
            ? Number((itemToDelete.cerrada_por as any).id)
            : Number(itemToDelete.cerrada_por),
        observaciones: itemToDelete.observaciones,
      };
      await deleteCajaDiaria(itemToDelete.id, payload);
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cajaDiaria"] });
      addToast({
        title: "Caja eliminada",
        description: "La caja se eliminó correctamente.",
        color: "success",
      });
    } catch (error) {
      console.error("Error al eliminar la caja:", error);
      addToast({
        title: "Error",
        description: "No se pudo eliminar la caja.",
        color: "danger",
      });
    }
  };

  // Definir renderCell para la tabla
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
              
              {userMe?.rol === "administrador" ? (
                <DropdownItem key="close" onPress={() => handleCloseCaja(item)}>
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
    const val = item[columnKey as keyof GetCajaDiaria];
    if (columnKey === "fecha_apertura" || columnKey === "fecha_cierre") {
      return formatDateTime(val as string | null);
    }
    if ((columnKey === "abierta_por" || columnKey === "cerrada_por") && val) {
      if (typeof val === "object" && "first_name" in val && "last_name" in val) {
        return `${val.first_name} ${val.last_name}`;
      } else {
        return String(val);
      }
    }
    return String(val ?? "");
  };

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
      items:
        usersData?.map((u) => ({
          id: u.id,
          name: `${u.first_name} ${u.last_name}`,
          email: u.email,
        })) ?? [],
    },
    {
      name: "observaciones",
      label: "Observaciones",
      type: "text",
    },
  ];

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
  const detailValues = selectedCaja
    ? {
        fecha_apertura: formatDateTime(selectedCaja.fecha_apertura ?? null),
        saldo_inicial: String(selectedCaja.saldo_inicial ?? ""),
        abierta_por:
          selectedCaja.abierta_por != null && typeof selectedCaja.abierta_por === "object"
            ? `${selectedCaja.abierta_por.first_name} ${selectedCaja.abierta_por.last_name}`
            : String(selectedCaja.abierta_por ?? ""),
        observaciones: selectedCaja.observaciones ?? "",
      }
    : {};

  const closeFields: FieldConfig[] = [
    {
      name: "saldo_final",
      label: "Saldo Final",
      type: "heroNumber",
    },
    {
      name: "observaciones",
      label: "Observaciones",
      type: "text",
    },
  ];

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

      {/* Modal: Crear nueva caja */}
      <GlobalModal
        title="Registrar Nueva Caja"
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        confirmLabel="Guardar"
        cancelLabel="Cancelar"
        onConfirm={async () => {
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
        }}
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

      {/* Modal: Cerrar caja */}
      <GlobalModal
        title="Cerrar Caja"
        isOpen={isCloseModalOpen}
        onOpenChange={setCloseModalOpen}
        confirmLabel="Cerrar caja"
        cancelLabel="Cancelar"
        onConfirm={handleCloseConfirm}
      >
        <GlobalForm
          fields={closeFields}
          values={closeFormValues}
          onChange={handleCloseFormChange}
        />
      </GlobalModal>

      {/* Modal: Confirmar eliminación de caja */}
      <GlobalModal
        title="Confirmar eliminación"
        isOpen={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteConfirm}
      >
        <div className="p-4">
          {itemToDelete && (
            <p>
              ¿Está seguro de eliminar la caja con fecha de apertura{" "}
              <strong>{formatDateTime(itemToDelete.fecha_apertura)}</strong>?
            </p>
          )}
        </div>
      </GlobalModal>
    </DefaultLayout>
  );
}

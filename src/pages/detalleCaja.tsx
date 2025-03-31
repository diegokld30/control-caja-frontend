// src/pages/DetalleCajaPage.tsx

import React from "react";
import DefaultLayout from "@/layouts/default";
import { useQueryClient } from "@tanstack/react-query";

// Hooks para obtener datos
import { useDetalleCaja } from "@/hooks/detalleCaja/getDetalleCaja";
import { useCajaDiaria } from "@/hooks/cajaDiaria/useCajaDiaria";
import { useTransacciones } from "@/hooks/transaccion/getTransaccion";

// APIs para detalle de caja
import { postDetalleCaja, DetalleCajaPostData } from "@/api/detalleCaja/postDetalleCaja";
import { updateDetalleCaja, DetalleCajaPutData } from "@/api/detalleCaja/putDetalleCaja";
import { deleteDetalleCaja } from "@/api/detalleCaja/deleteDetalleCaja";

// Nuevo endpoint para cerrar caja (consolidar transacciones)
import { cerrarCaja, CerrarCajaData } from "@/api/cajaDiaria/cerrarCaja";

// Tipo de DetalleCaja
import { GetDetalleCaja } from "@/types/detalleCaja/GetDetalleCaja";

// Componentes UI
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";
import { GlobalModal } from "@/components/GlobalModal";
import { GlobalForm, FieldConfig } from "@/components/GlobalForm";

// Componentes de HeroUI
import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { VerticalDotsIcon } from "@/components/icons";

// Extendemos FieldConfig para incluir isSearchable (si aún no lo tienes en tu definición global)
interface ExtendedFieldConfig extends FieldConfig {
  isSearchable?: boolean;
}

// Definición de ColumnDef (para la tabla)
interface ColumnDef<T> {
  name: string;
  uid: keyof T | "acciones";
  sortable?: boolean;
}

// Función para formatear fecha de forma amigable
function formatDateTime(isoString: string | null) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return (
    date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) +
    " " +
    date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

// Definición de columnas para la tabla
const columns: ColumnDef<GetDetalleCaja>[] = [
  { name: "Caja", uid: "caja_id" as keyof GetDetalleCaja, sortable: true },
  { name: "Transacción", uid: "transaccion_id" as keyof GetDetalleCaja, sortable: true },
  { name: "Descripción", uid: "descripcion" as keyof GetDetalleCaja, sortable: true },
  { name: "Tipo", uid: "tipo" as keyof GetDetalleCaja, sortable: true },
  { name: "Monto", uid: "monto" as keyof GetDetalleCaja, sortable: true },
  { name: "Fecha", uid: "fecha" as keyof GetDetalleCaja, sortable: true },
  { name: "Acciones", uid: "acciones" as "acciones" },
];

export default function DetalleCajaPage() {
  const queryClient = useQueryClient();

  // 1) Obtener datos
  const { data: detalles, isLoading, isError, error } = useDetalleCaja();
  const { data: cajas, isLoading: cajasLoading } = useCajaDiaria();
  const { data: transacciones, isLoading: transLoading } = useTransacciones();

  // 2) Estados para CRUD
  const [selectedDetalle, setSelectedDetalle] = React.useState<GetDetalleCaja | null>(null);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<GetDetalleCaja | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);

  // 3) Estado del formulario para crear/editar
  const [formValues, setFormValues] = React.useState({
    caja_id: "",
    transaccion_id: "",
    descripcion: "",
    tipo: "ingreso",
    monto: ""
  });
  const handleFormChange = (newVals: Record<string, any>) => {
    setFormValues((prev) => ({ ...prev, ...newVals }));
  };

  // 4) Verificar loading y error
  if (isLoading || cajasLoading || transLoading) {
    return (
      <DefaultLayout>
        <p className="text-center py-10">Cargando detalles de caja...</p>
      </DefaultLayout>
    );
  }
  if (isError) {
    return (
      <DefaultLayout>
        <p className="text-center py-10 text-red-500">
          Error al cargar detalles: {String(error)}
        </p>
      </DefaultLayout>
    );
  }

  // 5) Funciones CRUD

  async function handleCreate() {
    try {
      const payload: DetalleCajaPostData = {
        caja_id: parseInt(formValues.caja_id, 10),
        transaccion_id: parseInt(formValues.transaccion_id, 10),
        descripcion: formValues.descripcion,
        tipo: formValues.tipo as "ingreso" | "egreso" | "venta",
        monto: parseFloat(formValues.monto),
      };
      await postDetalleCaja(payload);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["detalleCaja"] });
      addToast({
        title: "Detalle de caja creado",
        description: "Se ha registrado exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al crear detalle de caja:", err);
      addToast({
        title: "Error",
        description: "No se pudo crear el detalle de caja.",
        color: "danger",
      });
    }
  }

  async function handleUpdate() {
    if (!selectedDetalle) return;
    try {
      const payload: DetalleCajaPutData = {
        caja_id: parseInt(formValues.caja_id, 10),
        transaccion_id: parseInt(formValues.transaccion_id, 10),
        descripcion: formValues.descripcion,
        tipo: formValues.tipo as "ingreso" | "egreso" | "venta",
        monto: parseFloat(formValues.monto),
      };
      await updateDetalleCaja(selectedDetalle.id!, payload);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["detalleCaja"] });
      addToast({
        title: "Detalle de caja actualizado",
        description: "Se ha modificado exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al actualizar detalle de caja:", err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar el detalle de caja.",
        color: "danger",
      });
    }
  }

  async function handleDeleteConfirm() {
    if (!itemToDelete) return;
    try {
      await deleteDetalleCaja(itemToDelete.id!);
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["detalleCaja"] });
      addToast({
        title: "Detalle de caja eliminado",
        description: "Se ha borrado correctamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al eliminar detalle de caja:", err);
      addToast({
        title: "Error",
        description: "No se pudo eliminar el detalle de caja.",
        color: "danger",
      });
    }
  }

  // Función para consolidar transacciones y cerrar caja (Opción 1)
  async function handleCerrarCaja() {
    // Se asume que tienes un endpoint para consolidar la caja
    // Por ejemplo, llamamos a `cerrarCaja` enviando el ID de la caja abierta.
    // Aquí suponemos que hay una única caja abierta (fecha_cierre es null).
    const cajaAbierta = cajas?.find((c) => !c.fecha_cierre);
    if (!cajaAbierta) {
      addToast({
        title: "Error",
        description: "No hay caja abierta para cerrar.",
        color: "danger",
      });
      return;
    }
    try {
      // Llamamos al endpoint que consolida las transacciones y crea un registro en DetalleCaja
      await cerrarCaja({ caja_id: cajaAbierta.id });
      queryClient.invalidateQueries({ queryKey: ["detalleCaja"] });
      addToast({
        title: "Caja cerrada",
        description: "El consolidado se ha generado correctamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al cerrar caja:", err);
      addToast({
        title: "Error",
        description: "No se pudo cerrar la caja.",
        color: "danger",
      });
    }
  }

  // 6) Acciones de UI para abrir modales
  function handleAddNew() {
    setIsEdit(false);
    setSelectedDetalle(null);
    setFormValues({
      caja_id: "",
      transaccion_id: "",
      descripcion: "",
      tipo: "ingreso",
      monto: ""
    });
    setModalOpen(true);
  }

  function handleEditItem(item: GetDetalleCaja) {
    setIsEdit(true);
    setSelectedDetalle(item);
    setFormValues({
      caja_id: String(item.caja_id),
      transaccion_id: String(item.transaccion_id),
      descripcion: item.descripcion,
      tipo: item.tipo,
      monto: String(item.monto),
    });
    setModalOpen(true);
  }

  function handleDeleteItem(item: GetDetalleCaja) {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  }

  // 7) Definir columnas para la tabla
  const columns: ColumnDef<GetDetalleCaja>[] = [
    { name: "Caja", uid: "caja_id" as keyof GetDetalleCaja, sortable: true },
    { name: "Transacción", uid: "transaccion_id" as keyof GetDetalleCaja, sortable: true },
    { name: "Descripción", uid: "descripcion" as keyof GetDetalleCaja, sortable: true },
    { name: "Tipo", uid: "tipo" as keyof GetDetalleCaja, sortable: true },
    { name: "Monto", uid: "monto" as keyof GetDetalleCaja, sortable: true },
    { name: "Fecha", uid: "fecha" as keyof GetDetalleCaja, sortable: true },
    { name: "Acciones", uid: "acciones" as "acciones" },
  ];

  // 8) renderCell para AdvancedGlobalTable
  const renderCell = (item: GetDetalleCaja, columnKey: string) => {
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
              <DropdownItem key="edit" onPress={() => handleEditItem(item)}>
                Editar
              </DropdownItem>
              <DropdownItem key="delete" onPress={() => handleDeleteItem(item)}>
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }
    if (columnKey === "caja_id") {
      return item.caja && item.caja.nombre
        ? item.caja.nombre
        : String(item.caja_id);
    }
    if (columnKey === "transaccion_id") {
      return item.transaccion && item.transaccion.tipo
        ? item.transaccion.tipo
        : String(item.transaccion_id);
    }
    if (columnKey === "fecha") {
      return formatDateTime(item.fecha);
    }
    return String((item as any)[columnKey] ?? "");
  };

  // 9) Mapeo para los selects:
  const cajaSelectItems =
    cajas?.map((c) => ({
      id: c.id,
      name: c.nombre || `Caja #${c.id}`,
    })) ?? [];
  const transaccionSelectItems =
    transacciones?.map((t) => ({
      id: t.id,
      name: t.tipo,
    })) ?? [];

  // 10) Definición de campos para el formulario de creación/edición
  const formFields: ExtendedFieldConfig[] = [
    {
      name: "caja_id",
      label: "Caja",
      type: "heroSelect",
      items: cajaSelectItems,
      isSearchable: true,
    },
    {
      name: "transaccion_id",
      label: "Transacción",
      type: "heroSelect",
      items: transaccionSelectItems,
      isSearchable: true,
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "text",
    },
    {
      name: "tipo",
      label: "Tipo",
      type: "heroSelect",
      items: [
        { id: "ingreso", name: "Ingreso" },
        { id: "egreso", name: "Egreso" },
        { id: "venta", name: "Venta" },
      ],
    },
    {
      name: "monto",
      label: "Monto",
      type: "heroNumber",
    },
  ];

  // 11) (Opcional) Campos para el modal de "Ver Detalles"
  const detailFields: FieldConfig[] = [
    { name: "caja_id", label: "Caja", type: "text" },
    { name: "transaccion_id", label: "Transacción", type: "text" },
    { name: "descripcion", label: "Descripción", type: "text" },
    { name: "tipo", label: "Tipo", type: "text" },
    { name: "monto", label: "Monto", type: "text" },
    { name: "fecha", label: "Fecha", type: "text" },
  ];
  const detailValues = selectedDetalle
    ? {
        caja_id: (() => {
          const c = cajas?.find((c) => c.id === selectedDetalle.caja_id);
          return c ? c.nombre || String(selectedDetalle.caja_id) : String(selectedDetalle.caja_id);
        })(),
        transaccion_id: selectedDetalle.transaccion && selectedDetalle.transaccion.tipo
          ? selectedDetalle.transaccion.tipo
          : String(selectedDetalle.transaccion_id),
        descripcion: selectedDetalle.descripcion,
        tipo: selectedDetalle.tipo,
        monto: String(selectedDetalle.monto),
        fecha: formatDateTime(selectedDetalle.fecha),
      }
    : {};

  // 12) Render final
  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalle de Caja</h1>
        {/* Botón para consolidar y cerrar la caja */}
        <Button color="primary" onPress={handleCerrarCaja}>
          Cerrar Caja
        </Button>
      </div>

      <AdvancedGlobalTable<GetDetalleCaja>
        title="Historial de detalle de caja"
        data={detalles ?? []}
        columns={columns}
        renderCell={renderCell}
        onAddNew={handleAddNew}
      />

      {/* Modal para crear o editar detalle de caja */}
      <GlobalModal
        title={isEdit ? "Editar Detalle de Caja" : "Crear Detalle de Caja"}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        confirmLabel={isEdit ? "Actualizar" : "Crear"}
        cancelLabel="Cancelar"
        onConfirm={isEdit ? handleUpdate : handleCreate}
      >
        <GlobalForm
          fields={formFields as FieldConfig[]}
          values={formValues}
          onChange={handleFormChange}
        />
      </GlobalModal>

      {/* Modal para confirmar eliminación */}
      <GlobalModal
        title="Eliminar Detalle de Caja"
        isOpen={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteConfirm}
      >
        <p className="p-4">
          ¿Deseas eliminar el detalle de caja:{" "}
          <strong>{itemToDelete?.descripcion}</strong> (ID:{" "}
          <strong>{itemToDelete?.id}</strong>)?
        </p>
      </GlobalModal>
    </DefaultLayout>
  );
}

// src/pages/TransaccionesPage.tsx

import React from "react";
import DefaultLayout from "@/layouts/default";
import { useQueryClient } from "@tanstack/react-query";

// Hooks para obtener datos
import { useTransacciones } from "@/hooks/transaccion/getTransaccion";
import { useProductosConStock } from "@/hooks/producto/useProductosConStock";
import { useUsers } from "@/hooks/users/getUsers";

// APIs para transacciones
import { postTransaccion, TransaccionPostData } from "@/api/transaccion/postTransaccion";
import { updateTransaccion, TransaccionPutData } from "@/api/transaccion/putTransaccion";
import { deleteTransaccion } from "@/api/transaccion/deleteTransaccion";

// Tipo de transacción
import { GetTransaccion } from "@/types/transaccion/GetTransaccion";

// Componentes UI personalizados
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";
import { GlobalModal } from "@/components/GlobalModal";
import { GlobalForm, FieldConfig } from "@/components/GlobalForm";

// Componentes de HeroUI
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { VerticalDotsIcon } from "@/components/icons";

export default function TransaccionesPage() {
  // 1) Declarar Hooks al inicio (orden fijo)
  const queryClient = useQueryClient();
  const { data: transacciones, isLoading, isError, error } = useTransacciones();
  const { data: productos, isLoading: prodLoading } = useProductosConStock();
  const { data: users, isLoading: usersLoading } = useUsers();

  // 2) Estados para crear/editar y eliminar
  const [selectedTransaccion, setSelectedTransaccion] = React.useState<GetTransaccion | null>(null);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<GetTransaccion | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);

  // 3) Estado del formulario (para crear/editar)
  const [formValues, setFormValues] = React.useState({
    tipo: "venta",
    producto_id: "",
    cantidad: "1",
    precio_unitario: "",
    usuario_id: ""
  });

  const handleFormChange = (newVals: Record<string, any>) => {
    setFormValues((prev) => ({ ...prev, ...newVals }));
  };

  // 4) useEffect para calcular automáticamente el precio unitario en ventas
  React.useEffect(() => {
    if (formValues.tipo === "venta" && productos) {
      const prodId = parseInt(formValues.producto_id, 10);
      const cantidadNum = parseInt(formValues.cantidad, 10) || 1;
      if (prodId && cantidadNum > 0) {
        const prod = productos.find((p) => p.id === prodId);
        if (prod) {
          // Se asume que el precio de venta viene como string y se multiplica por la cantidad.
          const precioVentaNum = parseFloat(prod.precio_venta);
          const subtotal = precioVentaNum * cantidadNum;
          setFormValues((prev) => ({
            ...prev,
            precio_unitario: subtotal.toFixed(2)
          }));
        }
      }
    }
  }, [formValues.tipo, formValues.producto_id, formValues.cantidad, productos]);

  // 5) Verificar loading y error (sin alterar el orden de hooks)
  if (isLoading || prodLoading || usersLoading) {
    return (
      <DefaultLayout>
        <p className="text-center py-10">Cargando transacciones...</p>
      </DefaultLayout>
    );
  }
  if (isError) {
    return (
      <DefaultLayout>
        <p className="text-center py-10 text-red-500">
          Error al cargar transacciones: {String(error)}
        </p>
      </DefaultLayout>
    );
  }

  // 6) Funciones CRUD

  // Crear transacción
  async function handleCreate() {
    try {
      const payload: TransaccionPostData = {
        tipo: formValues.tipo as "venta" | "compra" | "devolucion" | "ajuste",
        producto_id: parseInt(formValues.producto_id, 10),
        cantidad: parseInt(formValues.cantidad, 10),
        precio_unitario: formValues.precio_unitario,
        usuario_id: parseInt(formValues.usuario_id, 10)
      };
      await postTransaccion(payload);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
      addToast({
        title: "Transacción creada",
        description: "Se ha registrado exitosamente.",
        color: "success"
      });
    } catch (err) {
      console.error("Error al crear la transacción:", err);
      addToast({
        title: "Error",
        description: "No se pudo crear la transacción.",
        color: "danger"
      });
    }
  }

  // Actualizar transacción
  async function handleUpdate() {
    if (!selectedTransaccion) return;
    try {
      const payload: TransaccionPutData = {
        tipo: formValues.tipo as "venta" | "compra" | "devolucion" | "ajuste",
        producto_id: parseInt(formValues.producto_id, 10),
        cantidad: parseInt(formValues.cantidad, 10),
        precio_unitario: formValues.precio_unitario,
        usuario_id: parseInt(formValues.usuario_id, 10)
      };
      await updateTransaccion(selectedTransaccion.id!, payload);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
      addToast({
        title: "Transacción actualizada",
        description: "Se ha modificado exitosamente.",
        color: "success"
      });
    } catch (err) {
      console.error("Error al actualizar la transacción:", err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar la transacción.",
        color: "danger"
      });
    }
  }

  // Eliminar transacción
  async function handleDeleteConfirm() {
    if (!itemToDelete) return;
    try {
      await deleteTransaccion(itemToDelete.id!);
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
      addToast({
        title: "Transacción eliminada",
        description: "Se ha borrado correctamente.",
        color: "success"
      });
    } catch (err) {
      console.error("Error al eliminar la transacción:", err);
      addToast({
        title: "Error",
        description: "No se pudo eliminar la transacción.",
        color: "danger"
      });
    }
  }

  // 7) Acciones de UI para abrir modales
  function handleAddNew() {
    setIsEdit(false);
    setSelectedTransaccion(null);
    setFormValues({
      tipo: "venta",
      producto_id: "",
      cantidad: "1",
      precio_unitario: "",
      usuario_id: ""
    });
    setModalOpen(true);
  }

  function handleEditItem(item: GetTransaccion) {
    setIsEdit(true);
    setSelectedTransaccion(item);
    setFormValues({
      tipo: item.tipo,
      producto_id: String(item.producto_id),
      cantidad: String(item.cantidad),
      precio_unitario: item.precio_unitario,
      usuario_id: String(item.usuario_id)
    });
    setModalOpen(true);
  }

  function handleDeleteItem(item: GetTransaccion) {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  }

  // 8) Definir columnas de la tabla
  const columns = [
    { name: "Tipo", uid: "tipo", sortable: true },
    { name: "Producto", uid: "producto_id", sortable: true },
    { name: "Cantidad", uid: "cantidad", sortable: true },
    { name: "Precio Unit.", uid: "precio_unitario", sortable: true },
    { name: "Fecha", uid: "fecha", sortable: true },
    { name: "Usuario", uid: "usuario_id", sortable: true },
    { name: "Acciones", uid: "acciones" }
  ];

  // 9) renderCell para AdvancedGlobalTable
  const renderCell = (item: GetTransaccion, columnKey: string) => {
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
    if (columnKey === "producto_id") {
      // Si el backend envía el objeto producto, se muestra su nombre; de lo contrario, se muestra el ID.
      return item.producto?.nombre ?? String(item.producto_id);
    }
    if (columnKey === "usuario_id") {
      if (item.usuario) {
        return `${item.usuario.first_name} ${item.usuario.last_name}`;
      }
      return String(item.usuario_id);
    }
    return String((item as any)[columnKey] ?? "");
  };

  // 10) Mapeo para los selects:
  const productSelectItems =
    productos?.map((p) => ({
      id: p.id,
      name: p.nombre ?? ""
    })) ?? [];

  const userSelectItems =
    users?.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`
    })) ?? [];

  // 11) Definición de campos para el formulario (crear/editar)
  const formFields: FieldConfig[] = [
    {
      name: "tipo",
      label: "Tipo",
      type: "heroSelect",
      items: [
        { id: "venta", name: "Venta" },
        { id: "compra", name: "Compra" },
        { id: "devolucion", name: "Devolución" },
        { id: "ajuste", name: "Ajuste" }
      ]
    },
    {
      name: "producto_id",
      label: "Producto",
      type: "heroSelect",
      items: productSelectItems,
      isSearchable: true
    },
    {
      name: "cantidad",
      label: "Cantidad",
      type: "heroNumber"
    },
    {
      name: "precio_unitario",
      label: "Precio Unitario",
      type: "heroNumber"
      // Puedes agregar readOnly: true si deseas que sea solo calculado
    },
    {
      name: "usuario_id",
      label: "Usuario",
      type: "heroSelect",
      items: userSelectItems,
      isSearchable: true
    }
  ];

  // 12) Render final
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold mb-6">Transacciones</h1>

      <AdvancedGlobalTable<GetTransaccion>
        title="Historial de transacciones"
        data={transacciones ?? []}
        columns={columns}
        renderCell={renderCell}
        onAddNew={handleAddNew}
      />

      {/* Modal para crear o editar transacción */}
      <GlobalModal
        title={isEdit ? "Editar Transacción" : "Crear Transacción"}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        confirmLabel={isEdit ? "Actualizar" : "Crear"}
        cancelLabel="Cancelar"
        onConfirm={isEdit ? handleUpdate : handleCreate}
      >
        <GlobalForm
          fields={formFields}
          values={formValues}
          onChange={handleFormChange}
        />
      </GlobalModal>

      {/* Modal para confirmar eliminación */}
      <GlobalModal
        title="Eliminar Transacción"
        isOpen={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteConfirm}
      >
        <p className="p-4">
          ¿Deseas eliminar la transacción tipo{" "}
          <strong>{itemToDelete?.tipo}</strong> con ID{" "}
          <strong>{itemToDelete?.id}</strong>?
        </p>
      </GlobalModal>
    </DefaultLayout>
  );
}

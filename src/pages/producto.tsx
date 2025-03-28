// src/pages/producto/ProductoPage.tsx
import React from "react";
import DefaultLayout from "@/layouts/default";
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";
import { GlobalModal } from "@/components/GlobalModal";
import { GlobalForm, FieldConfig } from "@/components/GlobalForm";

import { useProducto } from "@/hooks/producto/getProducto"; // Hook para obtener productos
import { useCategoria } from "@/hooks/categoria/getCategoria"; // Hook para obtener categorías
import { useUserMe } from "@/hooks/users/getUserMe";
import { GetProductos } from "@/types/producto/GetProducto"; // Tipo de producto

import { postProducto, ProductoPostData } from "@/api/producto/postProducto"; // Para crear producto
import { updateProducto, ProductoPutData } from "@/api/producto/putProducto"; // Para actualizar producto
import { deleteProducto, ProductoDeleteData } from "@/api/producto/deleteProducto"; // Para eliminar producto

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

const columns: ColumnDef<GetProductos>[] = [
  { name: "Nombre", uid: "nombre", sortable: true },
  { name: "Categoría", uid: "categoria_id", sortable: true },
  { name: "Precio Compra", uid: "precio_compra", sortable: true },
  { name: "Precio Venta", uid: "precio_venta", sortable: true },
  { name: "Stock", uid: "stock", sortable: true },
  { name: "Acciones", uid: "acciones" },
];

export default function ProductoPage() {
  const queryClient = useQueryClient();

  // 1) Obtener productos
  const { data, isLoading } = useProducto();
  // 2) Obtener categorías para el select
  const { data: categorias, isLoading: catLoading } = useCategoria();
  // 3) Obtener datos del usuario logueado
  const { data: userMe, isLoading: userMeLoading } = useUserMe();

  // 4) Estados para los modales
  const [selectedProducto, setSelectedProducto] = React.useState<GetProductos | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = React.useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<GetProductos | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);

  // 5) Estado para los valores del formulario (crear/actualizar producto)
  const [formValues, setFormValues] = React.useState({
    nombre: "",
    categoria_id: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
  });
  const handleFormChange = (newValues: Record<string, any>) =>
    setFormValues((prev) => ({ ...prev, ...newValues }));

  // 6) Funciones de acción
  const handleView = (item: GetProductos) => {
    setSelectedProducto(item);
    setDetailModalOpen(true);
  };

  const handleEdit = (item: GetProductos) => {
    setSelectedProducto(item);
    setFormValues({
      nombre: item.nombre,
      categoria_id: String(item.categoria_id),
      precio_compra: item.precio_compra,
      precio_venta: item.precio_venta,
      stock: String(item.stock),
    });
    setUpdateModalOpen(true);
  };

  const handleDelete = (item: GetProductos) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // 7) Función para crear producto
  const handleConfirm = async () => {
    try {
      const payload: ProductoPostData = {
        nombre: formValues.nombre,
        categoria_id: parseInt(formValues.categoria_id),
        precio_compra: formValues.precio_compra,
        precio_venta: formValues.precio_venta,
        stock: parseInt(formValues.stock),
      };
      await postProducto(payload);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      addToast({
        title: "Producto creado",
        description: "El producto se creó exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al crear el producto:", err);
      addToast({
        title: "Error",
        description: "No se pudo crear el producto.",
        color: "danger",
      });
    }
  };

  // 8) Función para actualizar producto
  const handleUpdateConfirm = async () => {
    if (!selectedProducto) return;
    try {
      const payload: ProductoPutData = {
        nombre: formValues.nombre,
        categoria_id: parseInt(formValues.categoria_id),
        precio_compra: formValues.precio_compra,
        precio_venta: formValues.precio_venta,
        stock: parseInt(formValues.stock),
      };
      await updateProducto(selectedProducto.id!, payload);
      setUpdateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      addToast({
        title: "Producto actualizado",
        description: "El producto se actualizó exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al actualizar el producto:", err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar el producto.",
        color: "danger",
      });
    }
  };

  // 9) Función para eliminar producto
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      const payload: ProductoDeleteData = {
        nombre: itemToDelete.nombre,
        categoria_id: itemToDelete.categoria_id,
        precio_compra: itemToDelete.precio_compra,
        precio_venta: itemToDelete.precio_venta,
        stock: itemToDelete.stock,
      };
      await deleteProducto(itemToDelete.id!, payload);
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      addToast({
        title: "Producto eliminado",
        description: "El producto se eliminó correctamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      addToast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
        color: "danger",
      });
    }
  };

  // 10) renderCell para la tabla
  const renderCell = (item: GetProductos, columnKey: string) => {
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
                  Actualizar producto
                </DropdownItem>
              ) : null}
              {userMe?.rol === "administrador" ? (
                <DropdownItem key="delete" onPress={() => handleDelete(item)}>
                  Eliminar producto
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }
    if (columnKey === "categoria_id") {
      const cat = categorias?.find((c) => c.id === item.categoria_id);
      return cat ? cat.nombre ?? "" : String(item.categoria_id);
    }
    const val = item[columnKey as keyof GetProductos];
    return String(val ?? "");
  };

  // 11) Campos para el formulario de creación/actualización
  const formFields: FieldConfig[] = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
    },
    {
      name: "categoria_id",
      label: "Categoría",
      type: "heroSelect",
      items:
        categorias?.map((c) => ({
          id: c.id,
          name: c.nombre ?? "",
          email: "", // Si no hay email, dejar vacío
        })) ?? [],
    },
    {
      name: "precio_compra",
      label: "Precio Compra",
      type: "heroNumber",
    },
    {
      name: "precio_venta",
      label: "Precio Venta",
      type: "heroNumber",
    },
    {
      name: "stock",
      label: "Stock",
      type: "heroNumber",
    },
  ];

  // 12) Campos para el modal de "Ver Detalles"
  const detailFields: FieldConfig[] = [
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "categoria_id", label: "Categoría", type: "text" },
    { name: "precio_compra", label: "Precio Compra", type: "text" },
    { name: "precio_venta", label: "Precio Venta", type: "text" },
    { name: "stock", label: "Stock", type: "text" },
  ];
  const detailValues = selectedProducto
    ? {
        nombre: selectedProducto.nombre,
        categoria_id: (() => {
          const cat = categorias?.find((c) => c.id === selectedProducto.categoria_id);
          return cat ? cat.nombre ?? "" : String(selectedProducto.categoria_id);
        })(),
        precio_compra: selectedProducto.precio_compra,
        precio_venta: selectedProducto.precio_venta,
        stock: String(selectedProducto.stock),
      }
    : {};

  return (
    <DefaultLayout>
      {isLoading || catLoading || userMeLoading ? (
        <div>Cargando productos...</div>
      ) : (
        <>
          <AdvancedGlobalTable<GetProductos>
            title="Historial de productos"
            data={data ?? []}
            columns={columns}
            renderCell={renderCell}
            onAddNew={() => {
              setFormValues({
                nombre: "",
                categoria_id: "",
                precio_compra: "",
                precio_venta: "",
                stock: "",
              });
              setModalOpen(true);
            }}
          />

          {/* Modal: Crear nuevo producto */}
          <GlobalModal
            title="Registrar Nuevo Producto"
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

          {/* Modal: Ver detalles del producto */}
          <GlobalModal
            title="Detalles del Producto"
            isOpen={isDetailModalOpen}
            onOpenChange={setDetailModalOpen}
            confirmLabel="Cerrar"
            cancelLabel="Cancelar"
            onConfirm={() => setDetailModalOpen(false)}
          >
            {selectedProducto && (
              <GlobalForm
                fields={detailFields}
                values={detailValues}
                onChange={() => {}}
              />
            )}
          </GlobalModal>

          {/* Modal: Actualizar producto */}
          <GlobalModal
            title="Actualizar Producto"
            isOpen={isUpdateModalOpen}
            onOpenChange={setUpdateModalOpen}
            confirmLabel="Actualizar"
            cancelLabel="Cancelar"
            onConfirm={handleUpdateConfirm}
          >
            <GlobalForm
              fields={formFields}
              values={formValues}
              onChange={handleFormChange}
            />
          </GlobalModal>

          {/* Modal: Confirmar eliminación del producto */}
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
                  ¿Está seguro de eliminar el producto{" "}
                  <strong>{itemToDelete.nombre}</strong>?
                </p>
              )}
            </div>
          </GlobalModal>
        </>
      )}
    </DefaultLayout>
  );
}

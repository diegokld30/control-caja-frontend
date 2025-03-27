// src/pages/categoria.tsx
import React from "react";
import DefaultLayout from "@/layouts/default";
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";
import { GlobalModal } from "@/components/GlobalModal";
import { GlobalForm, FieldConfig } from "@/components/GlobalForm";

import { useCategoria } from "@/hooks/categoria/getCategoria";
import { useUsers } from "@/hooks/users/getUsers";
import { useUserMe } from "@/hooks/users/getUserMe";
import { GetCategoria } from "@/types/categoria/GetCategoria";
import { CategoriaPostData } from "@/api/categoria/postCategoria";
import { updateCategoria } from "@/api/categoria/putCategoria"; // Función para actualizar

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

const columns: ColumnDef<GetCategoria>[] = [
  { name: "Nombre", uid: "nombre", sortable: true },
  { name: "Acciones", uid: "acciones" },
];

export default function CategoriaPage() {
  const queryClient = useQueryClient();

  // 1) Obtener data de categorías
  const { data, isLoading, isError, error } = useCategoria();

  // 2) Obtener data de usuarios
  const { data: usersData, isLoading: usersLoading, isError: usersError } = useUsers();

  // 3) Obtener data del usuario logueado (para conocer su rol)
  const { data: userMe, isLoading: userMeLoading, isError: userMeError } = useUserMe();

  // 4) Estados para los modales
  const [selectedCategoria, setSelectedCategoria] = React.useState<GetCategoria | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = React.useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);

  // 5) Estado para los valores del formulario (para crear y actualizar)
  const [formValues, setFormValues] = React.useState({
    nombre: "",
  });

  function handleFormChange(newValues: Record<string, any>) {
    setFormValues((prev) => ({ ...prev, ...newValues }));
  }

  // 6) Manejo de loading / error
  if (isLoading || usersLoading || userMeLoading) {
    return <DefaultLayout>Cargando Categorías...</DefaultLayout>;
  }
  if (isError || usersError || userMeError) {
    return (
      <DefaultLayout>
        Error al cargar data: {String(error || usersError || userMeError)}
      </DefaultLayout>
    );
  }

  // 7) Funciones de acciones
  function handleView(item: GetCategoria) {
    setSelectedCategoria(item);
    setDetailModalOpen(true);
  }

  function handleEdit(item: GetCategoria) {
    setSelectedCategoria(item);
    // Precargamos el formulario con los datos actuales de la categoría
    setFormValues({
      nombre: item.nombre || "",
    });
    setUpdateModalOpen(true);
  }

  function handleDelete(item: GetCategoria) {
    console.log("Eliminar categoría:", item);
    // Aquí implementa la lógica de borrado si lo requieres.
  }

  // 8) Definir renderCell para la tabla
  const renderCell = (item: GetCategoria, columnKey: string) => {
    switch (columnKey) {
      case "nombre":
        return item.nombre;
        case "acciones":
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
                      Actualizar categoria
                    </DropdownItem>
                  ) : null}
  
                  {/* Condicional si el rol es "Administrador" */}
  
                  {userMe?.rol === "administrador" ? (
                    <DropdownItem key="delete" onPress={() => handleDelete(item)}>
                      Eliminar categoria
                    </DropdownItem>
                  ) : null}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
      default:
        return null;
    }
  };

  // 9) Campos para el formulario (se usan tanto para crear como para actualizar)
  const formFields: FieldConfig[] = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
    },
  ];

  // 10) Función para crear nueva categoría
  async function handleConfirm() {
    try {
      const payload = {
        nombre: String(formValues.nombre),
      };

      await CategoriaPostData(payload);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categoria"] });

      addToast({
        title: "Categoría creada",
        description: "La categoría se creó exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al crear la categoría:", err);
      addToast({
        title: "Error",
        description: "No se pudo crear la categoría.",
        color: "danger",
      });
    }
  }

  // 11) Función para actualizar la categoría
  async function handleUpdateConfirm() {
    if (!selectedCategoria) return;
    try {
      const payload = {
        nombre: formValues.nombre,
      };
      // Asumimos que selectedCategoria tiene la propiedad "id"
      await updateCategoria(selectedCategoria.id, payload);
      setUpdateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categoria"] });
      addToast({
        title: "Categoría actualizada",
        description: "La categoría se actualizó exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al actualizar la categoría:", err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar la categoría.",
        color: "danger",
      });
    }
  }

  // 12) Campos y valores para el modal de "Ver Detalles"
  const detailFields: FieldConfig[] = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
    },
  ];
  const detailValues = selectedCategoria
    ? {
        nombre: selectedCategoria.nombre ?? "",
      }
    : {};

  return (
    <DefaultLayout>
      <AdvancedGlobalTable<GetCategoria>
        title="Historial de categorías"
        data={data ?? []}
        columns={columns}
        renderCell={renderCell}
        onAddNew={() => {
          setFormValues({
            nombre: "",
          });
          setModalOpen(true);
        }}
      />

      {/* Modal para crear nueva categoría */}
      <GlobalModal
        title="Registrar Nueva Categoría"
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

      {/* Modal para ver detalles de la categoría */}
      <GlobalModal
        title="Detalles de la Categoría"
        isOpen={isDetailModalOpen}
        onOpenChange={setDetailModalOpen}
        confirmLabel="Cerrar"
        cancelLabel="Cancelar"
        onConfirm={() => setDetailModalOpen(false)}
      >
        {selectedCategoria && (
          <GlobalForm
            fields={detailFields}
            values={detailValues}
            onChange={() => {}}
          />
        )}
      </GlobalModal>

      {/* Modal para actualizar la categoría */}
      <GlobalModal
        title="Actualizar Categoría"
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
    </DefaultLayout>
  );
}

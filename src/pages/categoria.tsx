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

  // 1) Obtenemos data de la caja
  const { data, isLoading, isError, error } = useCategoria();

  // 2) Obtenemos data de los usuarios
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();

  // 3) Obtenemos data del usuario logueado (para saber su rol)
  const {
    data: userMe,
    isLoading: userMeLoading,
    isError: userMeError,
  } = useUserMe();

  // 4) Estado del modal (nueva caja)
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    nombre: "",
  });

  function handleFormChange(newValues: Record<string, any>) {
    setFormValues((prev) => ({ ...prev, ...newValues }));
  }

  // 5) Manejo de loading / error
  if (isLoading || usersLoading || userMeLoading) {
    return <DefaultLayout>Cargando Categorias...</DefaultLayout>;
  }
  if (isError || usersError || userMeError) {
    return (
      <DefaultLayout>
        Error al cargar data: {String(error || usersError || userMeError)}
      </DefaultLayout>
    );
  }

  // 6) Funciones de acciones
  function handleView(item: GetCategoria) {
    console.log("Ver detalles:", item);
  }
  function handleEdit(item: GetCategoria) {
    console.log("Cerrar caja:", item);
  }
  function handleDelete(item: GetCategoria) {
    console.log("Eliminar caja:", item);
    // Lógica de borrado
  }

  // 7) Definir renderCell adentro, para usar userMe?.rol
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
                    Cerrar caja
                  </DropdownItem>
                ) : null}

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
  };

  // 8) Mapeo de usuarios para heroSelect

  const formFields: FieldConfig[] = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
    },
  ];

  // 9) Crear nueva caja
  async function handleConfirm() {
    try {
      const payload = {
        nombre: String(formValues.nombre),
      };

      await CategoriaPostData(payload);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cajaDiaria"] });

      addToast({
        title: "Caja creada",
        description: "La categoria se creó exitosamente.",
        color: "success",
      });
    } catch (err) {
      console.error("Error al crear la categoria:", err);
      addToast({
        title: "Error",
        description: "No se pudo crear la categoria.",
        color: "danger",
      });
    }
  }
  console.log(data);

  return (
    <DefaultLayout>
      <AdvancedGlobalTable<GetCategoria>
        title="Historial de cajas"
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

      <GlobalModal
        title="Registrar Nueva Categoria"
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

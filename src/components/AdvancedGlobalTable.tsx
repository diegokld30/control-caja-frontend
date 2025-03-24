// src/components/AdvancedGlobalTable.tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@heroui/react";
import type { Key as AriaKey } from "@react-types/shared";
import { GlobalModal } from "@/components/GlobalModal";

//
//  Tipos e interfaces
//
interface ColumnDef<T> {
  /** Texto en la cabecera de la columna. */
  name: string;
  /** Clave del objeto T a mostrar en esa columna. */
  uid: keyof T;
  /** Indica si la columna permite ordenar. */
  sortable?: boolean;
}

interface AdvancedGlobalTableProps<T> {
  /** Título de la tabla. */
  title?: string;
  /** Datos (filas) a mostrar. */
  data: T[];
  /** Definición de columnas. */
  columns: ColumnDef<T>[];
  /**
   * Función opcional para personalizar cómo se dibuja la celda.
   * Si no se provee, se mostrará como texto (`String(value)`).
   */
  renderCell?: (item: T, columnKey: keyof T) => React.ReactNode;
  /**
   * Callback para dar una key única a cada fila.
   * Si no se define, se usará JSON.stringify del item.
   */
  getRowKey?: (item: T) => React.Key;
  /**
   * Callback para la acción de "Agregar".
   * Si no se define, la tabla muestra un modal interno.
   */
  onAddNew?: () => void;
  /**
   * Opcional: lista de opciones para "statusFilter".
   * Ej: [{ name: "Active", uid: "active" }, { name: "Paused", uid: "paused" }]
   */
  statusOptions?: Array<{ name: string; uid: string }>;
}

/** Capitaliza un string (opcional) */
function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

/**
 * Para manejar la selección múltiple, usaremos:
 *  - "all"
 *  - Set<string | number>
 *  (evitamos bigint o symbol, que generan problemas con Hero UI)
 */
type TableKey = string | number;

/**
 * Componente de tabla avanzada estilo Hero UI con:
 * - Búsqueda en columnas string u objeto (con { first_name, last_name })
 * - Selección de columnas visibles
 * - Filtro de "status"
 * - Ordenación (números o strings)
 * - Paginación
 * - Selección de filas ("all" o Set<string|number>)
 * - Botón "Add New" (opcional)
 */
export function AdvancedGlobalTable<T extends Record<string, any>>(
  props: AdvancedGlobalTableProps<T>
) {
  const {
    title = "tabla",
    data,
    columns,
    renderCell,
    getRowKey,
    onAddNew,
    statusOptions = [],
  } = props;

  // --------------------
  // Estado para el modal interno (si no se define onAddNew)
  // --------------------
  const [isModalOpen, setModalOpen] = React.useState(false);

  // --------------------
  // Otros estados de la tabla
  // --------------------

  // Búsqueda
  const [filterValue, setFilterValue] = React.useState("");
  // Selección de filas
  const [selectedKeys, setSelectedKeys] = React.useState<"all" | Set<TableKey>>(
    new Set<TableKey>()
  );
  // Columnas visibles
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    () => new Set(columns.map((c) => String(c.uid)))
  );
  // Filtro status
  const [statusFilter, setStatusFilter] = React.useState<"all" | Set<string>>("all");
  // Paginación
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  // Ordenación
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: String(columns[0]?.uid) || "",
    direction: "ascending",
  });

  // Indica si hay un texto de búsqueda
  const hasSearchFilter = Boolean(filterValue);

  // --------------------
  // 1) Búsqueda
  // --------------------
  const filteredBySearch = React.useMemo(() => {
    if (!filterValue) return data;
    const lower = filterValue.toLowerCase();

    return data.filter((item) =>
      // Buscamos coincidencia en cualquier columna visible
      Array.from(visibleColumns).some((colUid) => {
        let val = item[colUid];

        // 1) Si es string
        if (typeof val === "string") {
          return val.toLowerCase().includes(lower);
        }

        // 2) Si es un objeto con { first_name, last_name }
        if (val && typeof val === "object") {
          if ("first_name" in val && "last_name" in val) {
            const combined = `${val.first_name} ${val.last_name}`.toLowerCase();
            return combined.includes(lower);
          } else {
            // 3) Cualquier otro objeto -> JSON.stringify
            const strVal = JSON.stringify(val).toLowerCase();
            return strVal.includes(lower);
          }
        }

        // 4) Caso default (números, null, etc.)
        return false;
      })
    );
  }, [data, filterValue, visibleColumns]);

  // --------------------
  // 2) Filtrado por status (opcional)
  // --------------------
  const filteredData = React.useMemo(() => {
    if (statusFilter === "all") return filteredBySearch;
    if (!(statusFilter instanceof Set)) return filteredBySearch;
    // Suponemos que la propiedad "status" define el estado
    return filteredBySearch.filter((item) => statusFilter.has(String(item.status)));
  }, [filteredBySearch, statusFilter]);

  // --------------------
  // 3) Ordenación
  // --------------------
  const sortedData = React.useMemo(() => {
    if (!sortDescriptor.column) return filteredData;
    const arr = [...filteredData];

    arr.sort((a, b) => {
      const colKey = sortDescriptor.column;
      let first = a[colKey];
      let second = b[colKey];

      // Si son objetos, convertimos a string
      if (first && typeof first === "object") {
        if ("first_name" in first && "last_name" in first) {
          first = `${first.first_name} ${first.last_name}`;
        } else {
          first = JSON.stringify(first);
        }
      }
      if (second && typeof second === "object") {
        if ("first_name" in second && "last_name" in second) {
          second = `${second.first_name} ${second.last_name}`;
        } else {
          second = JSON.stringify(second);
        }
      }

      // Intento numérico
      const n1 = parseFloat(first);
      const n2 = parseFloat(second);
      if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
        return sortDescriptor.direction === "ascending" ? n1 - n2 : n2 - n1;
      }

      // Comparación string
      const str1 = String(first ?? "").toLowerCase();
      const str2 = String(second ?? "").toLowerCase();

      if (str1 < str2) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (str1 > str2) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [filteredData, sortDescriptor]);

  // --------------------
  // 4) Paginación
  // --------------------
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentPageItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  // --------------------
  // Render cell por defecto
  // --------------------
  function defaultRenderCell(item: T, columnKey: keyof T) {
    return String(item[columnKey] ?? "");
  }

  // --------------------
  // rowKey
  // --------------------
  function rowKeyFn(item: T): React.Key {
    return getRowKey ? getRowKey(item) : JSON.stringify(item);
  }

  // --------------------
  // Botón "Agregar"
  // --------------------
  function handleAddNew() {
    if (onAddNew) {
      onAddNew();
    } else {
      setModalOpen(true);
    }
  }

  // --------------------
  // Manejo de selección
  // --------------------
  function handleSelectionChange(keys: "all" | Iterable<AriaKey>) {
    if (keys === "all") {
      setSelectedKeys("all");
    } else {
      // Convierto a array de string|number
      const arr = [...keys].map((k) => String(k));
      setSelectedKeys(new Set(arr));
    }
  }

  // --------------------
  // topContent
  // --------------------
  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={(val) => {
            setFilterValue(val);
            setPage(1);
          }}
        />

        <div className="flex gap-3">
          {statusOptions.length > 0 && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat">Estado ▼</Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => setStatusFilter(keys as Set<string> | "all")}
              >
                {statusOptions.map((opt) => (
                  <DropdownItem key={opt.uid} className="capitalize">
                    {opt.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}

          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button variant="flat">Columnas ▼</Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  setVisibleColumns(new Set(columns.map((c) => String(c.uid))));
                } else {
                  setVisibleColumns(keys as Set<string>);
                }
              }}
            >
              {columns.map((col) => (
                <DropdownItem key={String(col.uid)} className="capitalize">
                  {capitalize(col.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button color="primary" onPress={handleAddNew}>
            Agregar
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {sortedData.length} items
        </span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small ml-2"
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );

  // --------------------
  // bottomContent
  // --------------------
  const bottomContent = (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        showControls
        color="default"
        page={page}
        total={totalPages}
        variant="light"
        onChange={setPage}
      />
      <span className="text-small text-default-400">
        {selectedKeys === "all"
          ? "All items selected"
          : `${selectedKeys instanceof Set ? selectedKeys.size : 0} of ${
              sortedData.length
            } selected`}
      </span>
    </div>
  );

  // --------------------
  // Render final
  // --------------------
  return (
    <div className="max-w-5xl w-full mx-auto">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

      <Table
        aria-label="Advanced Global Table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        selectionMode="multiple"
        // Hero UI => selectedKeys?: "all" | Iterable<Key> | undefined
        // Convertimos nuestro "all" | Set<string> a "all" | Iterable<Key>
        selectedKeys={
          selectedKeys === "all"
            ? "all"
            : (selectedKeys as unknown as Iterable<AriaKey>)
        }
        onSelectionChange={handleSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) => {
          setSortDescriptor({
            column: String(descriptor.column),
            direction: descriptor.direction,
          });
        }}
      >
        <TableHeader
          columns={columns.filter((col) => visibleColumns.has(String(col.uid)))}
        >
          {(column) => (
            <TableColumn
              key={String(column.uid)}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="No items found" items={currentPageItems}>
          {(item) => (
            <TableRow key={getRowKey ? getRowKey(item) : JSON.stringify(item)}>
              {(columnKey) => (
                <TableCell>
                  {renderCell
                    ? renderCell(item, columnKey as keyof T)
                    : String(item[columnKey])}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/** Modal interno que se abre al hacer clic en “Agregar”, si onAddNew no está definido */}
      <GlobalModal
        title="Registrar Nuevo"
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        confirmLabel="Guardar"
        cancelLabel="Cancelar"
        onConfirm={() => {
          console.log("Guardando...");
          // Aquí pondrías la lógica de "crear algo" o un form
        }}
      >
        <p>Aquí podrías poner un formulario o inputs para crear un nuevo elemento.</p>
      </GlobalModal>
    </div>
  );
}

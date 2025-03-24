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
import { GlobalModal } from "@/components/GlobalModal"; // Importamos el modal global

//
//  Tipos e interfaces
//
interface ColumnDef<T> {
  name: string;
  uid: keyof T;
  sortable?: boolean;
}

interface AdvancedGlobalTableProps<T> {
  title?: string;
  data: T[];
  columns: ColumnDef<T>[];
  renderCell?: (item: T, columnKey: keyof T) => React.ReactNode;
  getRowKey?: (item: T) => React.Key;
  /**
   * Si quieres que un padre controle la acción de "Agregar",
   * usa onAddNew. Si no se define, la tabla mostrará su modal interno.
   */
  onAddNew?: () => void;
  statusOptions?: Array<{ name: string; uid: string }>;
}

/** Capitaliza un string */
function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

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
  // Estado para el modal
  // --------------------
  const [isModalOpen, setModalOpen] = React.useState(false);

  // --------------------
  // Otros estados de la tabla
  // --------------------
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<"all" | Set<React.Key>>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    () => new Set(columns.map((c) => String(c.uid)))
  );
  const [statusFilter, setStatusFilter] = React.useState<"all" | Set<string>>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: String(columns[0]?.uid) || "",
    direction: "ascending",
  });

  // Manejo de filtrado, orden, paginación... (igual que antes)
  const hasSearchFilter = Boolean(filterValue);

  const filteredBySearch = React.useMemo(() => {
    if (!filterValue) return data;
    const lower = filterValue.toLowerCase();
    return data.filter((item) =>
      Array.from(visibleColumns).some((colUid) => {
        const val = item[colUid];
        if (typeof val === "string") {
          return val.toLowerCase().includes(lower);
        }
        return false;
      })
    );
  }, [data, filterValue, visibleColumns]);

  const filteredData = React.useMemo(() => {
    if (statusFilter === "all") return filteredBySearch;
    if (!(statusFilter instanceof Set)) return filteredBySearch;
    // Filtra asumiendo que la propiedad se llama "status"
    return filteredBySearch.filter((item) => statusFilter.has(String(item.status)));
  }, [filteredBySearch, statusFilter]);

  const sortedData = React.useMemo(() => {
    if (!sortDescriptor.column) return filteredData;
    const arr = [...filteredData];

    arr.sort((a, b) => {
      const colKey = sortDescriptor.column;
      let first = a[colKey];
      let second = b[colKey];
      const n1 = parseFloat(first);
      const n2 = parseFloat(second);
      if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
        return sortDescriptor.direction === "ascending" ? n1 - n2 : n2 - n1;
      }
      first = String(first ?? "").toLowerCase();
      second = String(second ?? "").toLowerCase();
      if (first < second) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (first > second) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredData, sortDescriptor]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentPageItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  function defaultRenderCell(item: T, columnKey: keyof T) {
    return String(item[columnKey] ?? "");
  }

  function rowKey(item: T): React.Key {
    return getRowKey ? getRowKey(item) : JSON.stringify(item);
  }

  // --------------------
  // Lógica para el botón "Agregar"
  // --------------------
  function handleAddNew() {
    // Si un padre maneja "Agregar", lo llamamos:
    if (onAddNew) {
      onAddNew();
    } else {
      // De lo contrario, abrimos el modal interno
      setModalOpen(true);
    }
  }

  // --------------------
  // topContent: barra búsqueda, combos, y botón Agregar
  // --------------------
  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar... "
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
                onSelectionChange={(keys) => setStatusFilter(keys)}
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
  // bottomContent: paginación y selección
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
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
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
            <TableRow key={rowKey(item)}>
              {(columnKey) => (
                <TableCell>
                  {renderCell
                    ? renderCell(item, columnKey as keyof T)
                    : defaultRenderCell(item, columnKey as keyof T)}
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
          // Aqui pones la lógica de "crear algo" o un form
        }}
      >
        <p>Aquí podrías poner un formulario o inputs para crear un nuevo elemento.</p>
      </GlobalModal>
    </div>
  );
}

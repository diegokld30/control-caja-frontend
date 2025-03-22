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
  Chip,
  User,
} from "@heroui/react";

//
//  Tipos e interfaces
//
interface ColumnDef<T> {
  /** Texto en la cabecera de la columna. */
  name: string;
  /** Clave del objeto `T` a mostrar en esa columna. */
  uid: keyof T;
  /** Indica si la columna permite ordenar (sort). */
  sortable?: boolean;
}

interface AdvancedGlobalTableProps<T> {
  /** Título que se mostrará arriba. */
  title?: string;

  /** Arreglo de datos (filas) a mostrar. */
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
   * Si no se define, se usará JSON.stringify del item (no ideal).
   */
  getRowKey?: (item: T) => React.Key;

  /**
   * Llamado cuando el usuario hace clic en el botón "Add New" (si lo quieres).
   */
  onAddNew?: () => void;

  /**
   * Opcional: lista de opciones para "statusFilter". 
   * Ejemplo: 
   *  [{ name: "Active", uid: "active" }, { name: "Paused", uid: "paused" }]
   */
  statusOptions?: Array<{ name: string; uid: string }>;
}

/**
 * Función auxiliar para capitalizar un string
 */
function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

/**
 * Componente de tabla avanzada estilo Hero UI con:
 * - Búsqueda global en todas las columnas
 * - Selección de columnas visibles
 * - Filtro de "status" (opcional)
 * - Ordenación (sorting) en columnas con `sortable: true`
 * - Paginación
 * - Selección de filas
 * - Botón "Add New"
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
  // Estados del componente
  // --------------------

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<"all" | Set<React.Key>>(new Set([]));

  // Columnas visibles: por defecto, incluimos todas
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    () => new Set(columns.map((col) => String(col.uid)))
  );

  // Si NO necesitas filtrar por "status", ignora esto. 
  // Para filtrar varios "status", podríamos usar un Set<string>.
  const [statusFilter, setStatusFilter] = React.useState<"all" | Set<string>>("all");

  // Paginación
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);

  // Ordenación
  // Acorde a Hero UI, Table usa {column, direction}
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: String(columns[0]?.uid) || "",
    direction: "ascending",
  });

  // --------------------
  // Lógica de filtrado, ordenación, paginación
  // --------------------

  // Determina si hay texto a filtrar
  const hasSearchFilter = Boolean(filterValue);

  // 1) Filtrado por texto (en TODAS las columnas visibles).
  const filteredBySearch = React.useMemo(() => {
    if (!filterValue) return data;
    const lower = filterValue.toLowerCase();
    return data.filter((item) =>
      // Buscamos coincidencia en cualquier columna visible
      Array.from(visibleColumns).some((colUid) => {
        const val = item[colUid];
        if (typeof val === "string") {
          return val.toLowerCase().includes(lower);
        }
        return false;
      })
    );
  }, [data, filterValue, visibleColumns]);

  // 2) Filtrado por status (opcional)
  const filteredData = React.useMemo(() => {
    if (statusFilter === "all") return filteredBySearch;
    if (!(statusFilter instanceof Set)) return filteredBySearch;

    // Suponemos que la propiedad "status" se llama "status" en el objeto T
    // Ajusta si la propiedad se llama distinto
    return filteredBySearch.filter((item) => statusFilter.has(String(item.status)));
  }, [filteredBySearch, statusFilter]);

  // 3) Ordenación
  const sortedData = React.useMemo(() => {
    if (!sortDescriptor.column) return filteredData;
    const arr = [...filteredData];

    arr.sort((a, b) => {
      const colKey = sortDescriptor.column;
      let first = a[colKey];
      let second = b[colKey];

      // Intento numérico
      const n1 = parseFloat(first);
      const n2 = parseFloat(second);
      if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
        return sortDescriptor.direction === "ascending" ? n1 - n2 : n2 - n1;
      }

      // Comparación string
      first = String(first ?? "").toLowerCase();
      second = String(second ?? "").toLowerCase();

      if (first < second) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (first > second) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [filteredData, sortDescriptor]);

  // 4) Paginación
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentPageItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  // --------------------
  // Render helpers
  // --------------------

  function defaultRenderCell(item: T, columnKey: keyof T) {
    return String(item[columnKey] ?? "");
  }

  function rowKey(item: T): React.Key {
    // preferimos un callback del usuario
    return getRowKey ? getRowKey(item) : JSON.stringify(item);
  }

  // topContent: buscador, combos, y botón "Add New"
  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        {/* Búsqueda */}
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
          {/* Filtro de "status" */}
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

          {/* Selección de columnas visibles */}
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
                  // signfica que se seleccionaron todas
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

          {/* Botón "Add New" */}
          {onAddNew && (
            <Button color="primary" onPress={onAddNew}>
              Agregar
            </Button>
          )}
        </div>
      </div>

      {/* Info (total items) y selección de "rows per page" */}
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

  // bottomContent: paginación y selección
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
        // Selección de filas
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        // Sorting
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) => {
          setSortDescriptor({
            column: String(descriptor.column),
            direction: descriptor.direction,
          });
        }}
      >
        <TableHeader
          // Solo mostramos las columnas que estén en `visibleColumns`
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
    </div>
  );
}

// src/components/GlobalTable.tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
// Si usas Hero UI Dropdown/Pagination, impórtalos así:

// etc.

type Column<T> = {
  name: string;
  uid: keyof T;       // p. ej. "fecha_cierre", "abierta_por", etc.
  sortable?: boolean;
};

interface GlobalTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  // Permite personalizar la celda (igual que el "renderCell" que hicimos antes)
  renderCell?: (item: T, columnKey: keyof T) => React.ReactNode;
}

export function GlobalTable<T extends Record<string, any>>(props: GlobalTableProps<T>) {
  const { data, columns, title = "Tabla Global", renderCell } = props;

  // ----- Estados para búsqueda y paginación:
  const [filterValue, setFilterValue] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);

  // ----- Filtrado simple (opcional):
  const filteredData = React.useMemo(() => {
    if (!filterValue) return data;
    const lower = filterValue.toLowerCase();
    // Filtra en cualquier columna string (básico)
    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.uid];
        if (typeof val === "string") {
          return val.toLowerCase().includes(lower);
        }
        return false;
      })
    );
  }, [data, filterValue, columns]);

  // ----- Paginación:
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page, rowsPerPage]);

  // ----- Render genérico de celda, si no proporcionan `renderCell`
  const defaultRenderCell = (item: T, columnKey: keyof T) => {
    const cellValue = item[columnKey];
    // Si es objeto (ej. { id, username, ... }), conviértelo en string
    if (cellValue && typeof cellValue === "object") {
      // Personaliza según tu caso: username, email, etc.
      if (cellValue.username) return cellValue.username;
      return JSON.stringify(cellValue);
    }
    return String(cellValue ?? "");
  };

  // Handler para cambiar # de filas
  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  // Render final
  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold">{title}</h2>

      {/* Filtros arriba (ejemplo: buscador + selector de rowsPerPage) */}
      <div className="flex items-center gap-2 justify-between">
        <Input
          placeholder="Buscar..."
          value={filterValue}
          onValueChange={(val) => {
            setFilterValue(val);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <div className="flex items-center gap-2">
          <label>Rows:</label>
          <select value={rowsPerPage} onChange={handleRowsChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>

      <Table aria-label="Global reusable table" className="w-full">
        {/* Encabezado */}
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={String(column.uid)}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        {/* Cuerpo */}
        <TableBody items={paginatedData}>
          {(item) => (
            <TableRow key={String(Object.values(item).join("-"))}>
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

      {/* Paginación simple (Anterior / Siguiente) */}
      <div className="flex justify-between items-center mt-2">
        <Button
          disabled={page <= 1}
          onPress={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </Button>
        <span>Página {page} de {totalPages || 1}</span>
        <Button
          disabled={page >= totalPages}
          onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

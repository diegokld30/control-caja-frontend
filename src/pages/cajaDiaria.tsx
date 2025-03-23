import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { useCajaDiaria } from "@/hooks/cajaDiaria/getCajaDiaria";
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";
import { GetCajaDiaria } from "@/types/cajaDiaria/GetCajaDiaria";


interface ColumnDef<T> {
  /** Texto en la cabecera de la columna. */
  name: string;
  /** Clave del objeto `T` a mostrar en esa columna. */
  uid: keyof T;
  /** Indica si la columna permite ordenar (sort). */
  sortable?: boolean;
}
// Columnas definidas según tu modelo "CajaDiaria"
const columns: ColumnDef<GetCajaDiaria>[] = [
  { name: "Fecha Apertura", uid: "fecha_apertura" as keyof GetCajaDiaria, sortable: true },
  { name: "Fecha Cierre", uid: "fecha_cierre" as keyof GetCajaDiaria, sortable: true },
  { name: "Saldo Inicial", uid: "saldo_inicial" as keyof GetCajaDiaria, sortable: true },
  { name: "Saldo Final", uid: "saldo_final" as keyof GetCajaDiaria, sortable: true },
  { name: "Abierta Por", uid: "abierta_por" as keyof GetCajaDiaria },
  { name: "Cerrada Por", uid: "cerrada_por" as keyof GetCajaDiaria },
  { name: "Observaciones", uid: "observaciones" as keyof GetCajaDiaria },
];



function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// Render personalizado para tus celdas
function renderCell(item: any, columnKey: string) {
  const val = item[columnKey];
  if (
    (columnKey === "fecha_apertura" || columnKey === "fecha_cierre") &&
    typeof val === "string"
  ) {
    return formatDateTime(val);
  }
  if (
    (columnKey === "abierta_por" || columnKey === "cerrada_por") &&
    val &&
    typeof val === "object"
  ) {
    // Ejemplo: si es {first_name, last_name}
    return `${val.first_name} ${val.last_name}`;
  }
  return String(val ?? "");
}

export default function CajaDiariaPage() {
  const { data, isLoading, isError, error } = useCajaDiaria();

  if (isLoading) {
    return <DefaultLayout>Cargando caja diaria...</DefaultLayout>;
  }
  if (isError) {
    return (
      <DefaultLayout>
        Error al cargar caja diaria: {String(error)}
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Control de caja.</h1>
      </div>
      <section className="py-8 md:py-10">
        <AdvancedGlobalTable
          title="Cajas diarias"
          data={data ?? []}
          columns={columns}
          renderCell={renderCell}
          // Si deseas un callback al pulsar “Add New”, pasarlo:
          onAddNew={() => alert("Nuevo registro")}
          // Si tus objetos no tienen “id”, define un getKey:
          // getKey={(item) => item.fecha_apertura + item.saldo_inicial}
        />
      </section>
    </DefaultLayout>
  );
}

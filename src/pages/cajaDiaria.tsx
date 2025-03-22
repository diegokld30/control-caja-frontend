import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { useCajaDiaria } from "@/hooks/cajaDiaria/getCajaDiaria";
import { AdvancedGlobalTable } from "@/components/AdvancedGlobalTable";

// Columnas definidas según tu modelo "CajaDiaria"
const columns = [
  { name: "Fecha Apertura", uid: "fecha_apertura", sortable: true },
  { name: "Fecha Cierre", uid: "fecha_cierre", sortable: true },
  { name: "Saldo Inicial", uid: "saldo_inicial", sortable: true },
  { name: "Saldo Final", uid: "saldo_final", sortable: true },
  { name: "Abierta Por", uid: "abierta_por" },
  { name: "Cerrada Por", uid: "cerrada_por" },
  { name: "Observaciones", uid: "observaciones" },
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

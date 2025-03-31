// src/types/detalleCaja/GetDetalleCaja.tsx

export type GetDetalleCaja = {
    id: number;
    caja_id: number;
    transaccion_id: number; // Agregado para que coincida con lo que usas en la vista
    descripcion?: string;
    tipo: "ingreso" | "egreso" | "venta";
    monto: string; // Se espera que DRF retorne el decimal como string
    fecha: string;
    // Opcional: si el serializer anida información
    caja?: {
      id: number;
      nombre: string;
      // Otros campos que retornes en CajaDiariaSerializer
    };
    transaccion?: {
      id: number;
      tipo: string;
      // Otros campos de Transaccion, si los incluyes
    };
  };
  
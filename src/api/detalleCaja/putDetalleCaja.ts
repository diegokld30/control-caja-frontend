import { api } from "../axiosInstance";

export interface DetalleCajaPutData {
  caja_id: number;
  transaccion_id: number;
  descripcion: string;
  tipo: "ingreso" | "egreso" | "venta";
  monto: number;
}

export async function updateDetalleCaja(
  id: number,
  data: DetalleCajaPutData
): Promise<any> {
  const response = await api.put(`/detallecaja/${id}/`, data);
  return response.data;
}

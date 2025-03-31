import { api } from "../axiosInstance";

export interface DetalleCajaPostData {
  caja_id: number;
  transaccion_id: number;
  descripcion: string;
  tipo: "ingreso" | "egreso" | "venta";
  monto: number;
}

export async function postDetalleCaja(
  data: DetalleCajaPostData
): Promise<any> {
  const response = await api.post("/detallecaja/", data);
  return response.data;
}

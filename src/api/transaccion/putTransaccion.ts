// src/api/transaccion/putTransaccion.ts
import { api } from "../axiosInstance";

export interface TransaccionPutData {
  tipo: "venta" | "compra" | "devolucion" | "ajuste";
  producto_id: number;
  cantidad: number;
  precio_unitario: string;
  usuario_id: number;
  // fecha normalmente no se actualiza, auto_now_add
}

export async function updateTransaccion(id: number, data: TransaccionPutData) {
  const response = await api.put(`/transacciones/${id}/`, data);
  return response.data;
}

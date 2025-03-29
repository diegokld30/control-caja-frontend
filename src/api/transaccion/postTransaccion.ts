// src/api/transaccion/postTransaccion.ts
import { api } from "../axiosInstance";

export interface TransaccionPostData {
  tipo: "venta" | "compra" | "devolucion" | "ajuste";
  producto_id: number;
  cantidad: number;
  precio_unitario: string;
  usuario_id: number;
  // fecha no se envía, auto_now_add
}

export async function postTransaccion(data: TransaccionPostData) {
  const response = await api.post("/transacciones/", data);
  return response.data;
}

// src/api/cajaDiaria/postCajaDiaria.ts
import { api } from "../axiosInstance";

/**
 * Define el tipo (o interfaz) para los datos que envías al POST.
 * Ajusta según tu modelo/serializer en DRF.
 */
export interface CajaDiariaPostData {
  fecha_cierre: string | null;
  saldo_inicial: string;
  saldo_final: string;
  abierta_por: number;
  cerrada_por: number;
  observaciones: string;
}

/**
 * Función para crear una nueva CajaDiaria vía POST.
 * Devuelve la respuesta del servidor (por ejemplo, el objeto creado).
 */
export async function postCajaDiaria(
  data: CajaDiariaPostData
): Promise<any> {
  const response = await api.post(
    "cajadiaria/",
    data
  );
  return response.data; // o response
}

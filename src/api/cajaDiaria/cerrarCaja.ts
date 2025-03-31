// src/api/cajaDiaria/cerrarCaja.ts
import { api } from "../axiosInstance";

export interface CerrarCajaData {
  caja_id: number;
}

export async function cerrarCaja(data: CerrarCajaData): Promise<any> {
  // Ajusta la ruta según tu configuración. Si tu baseURL incluye "/api", puede ser solo "/cajaDiaria/cerrar/"
  const response = await api.post("/cajadiaria/cerrar/", data);
  return response.data;
}

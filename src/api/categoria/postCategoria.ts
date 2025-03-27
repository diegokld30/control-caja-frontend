// src/api/categoria/postCategoria.ts
import { api } from "../axiosInstance";

/**
 * Define el tipo (o interfaz) para los datos que envías al POST.
 * Ajusta según tu modelo/serializer en DRF.
 */
export interface CategoriaPostData {
  nombre: string | null;
}

export async function CategoriaPostData(
  data: CategoriaPostData
): Promise<any> {
  const response = await api.post(
    "categoria/",
    data
  );
  return response.data; // o response
}

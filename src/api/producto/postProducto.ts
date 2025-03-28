// src/api/producto/postProducto.ts
import { api } from "../axiosInstance";

/**
 * Define el tipo (o interfaz) para los datos que envías al POST.
 * Ajusta según tu modelo/serializer en DRF.
 */
export interface ProductoPostData {
    nombre: string;           // Campo requerido, entre 1 y 100 caracteres
    categoria_id: number;     // Id de la categoría (requerido)
    precio_compra: string;    // Precio de compra (string que representa un decimal)
    precio_venta: string;     // Precio de venta (string que representa un decimal)
    stock: number;            // Stock (entero)
    acciones?: string | null; // Campo opcional para acciones en la tabla
}

export async function postProducto(
  data: ProductoPostData
): Promise<any> {
  const response = await api.post(
    "productos/",
    data
  );
  return response.data; // o response
}

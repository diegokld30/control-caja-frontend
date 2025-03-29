// src/api/producto/getProductosConStock.ts
import { api } from "@/api/axiosInstance";
import { GetProductos } from "@/types/producto/GetProducto";

/**
 * Retorna solo los productos con stock>0 (filtra en frontend, por ejemplo).
 */
export async function getProductosConStock(): Promise<GetProductos[]> {
  const response = await api.get("/productos/");
  const productos = response.data as GetProductos[];
  // Filtrado en frontend
  return productos.filter((p) => p.stock > 0);
}

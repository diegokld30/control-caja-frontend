// src/hooks/producto/useProductosConStock.ts
import { useQuery } from "@tanstack/react-query";
import { getProductosConStock } from "@/api/producto/getProductosConStock";
import { GetProductos } from "@/types/producto/GetProducto";

export function useProductosConStock() {
  return useQuery<GetProductos[]>({
    queryKey: ["productosConStock"],
    queryFn: getProductosConStock,
  });
}

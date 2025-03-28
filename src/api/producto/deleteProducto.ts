// src/api/producto/deleteProducto

import { api } from "../axiosInstance"

export type ProductoDeleteData={
    id?: number;
    nombre: string;           // Campo requerido, entre 1 y 100 caracteres
    categoria_id: number;     // Id de la categoría (requerido)
    precio_compra: string;    // Precio de compra (string que representa un decimal)
    precio_venta: string;     // Precio de venta (string que representa un decimal)
    stock: number;            // Stock (entero)
    acciones?: string | null; // Campo opcional para acciones en la tabla
}

export async function deleteProducto(
    id:number,
    data: ProductoDeleteData
): Promise<any> {
    const response = await api.delete(`productos/${id}/`, {data});    
    return response.data
}
// src/api/categoria/deleteCategoria

import { api } from "../axiosInstance"

export type CategoriaDeleteData={
    nombre: string | null;
}

export async function deleteCategoria(
    id:number,
    data: CategoriaDeleteData
): Promise<any> {
    const response = await api.delete(`categoria/${id}/`, {data});    
    return response.data
}
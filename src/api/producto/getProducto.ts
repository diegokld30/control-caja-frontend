//src/api/producto/getProducto.ts
import { GetProductos } from '@/types/producto/GetProducto'
import { api } from '../axiosInstance'

export const getProducto = async (): Promise<GetProductos[]> => {
    const response = await api.get('/productos/')
    return response.data
}
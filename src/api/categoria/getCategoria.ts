import { GetCategoria } from '@/types/categoria/GetCategoria'
import { api } from '../axiosInstance'

export const getCategoria = async (): Promise<GetCategoria[]> => {
    const response = await api.get('/categoria/')
    return response.data
}
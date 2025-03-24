import axios from "axios";

/** Estructura de datos que retorna DRF al hacer login */
export interface TokenResponse {
  refresh: string;
  access: string;
}

/** Estructura para enviar al login */
export interface LoginData {
  username: string;
  password: string;
}

/** POST /api/auth/token/ para obtener access y refresh */
export async function login(data: LoginData): Promise<TokenResponse> {
  const response = await axios.post("http://127.0.0.1:8000/api/auth/token/", data);
  return response.data;
}

/** POST /api/auth/token/refresh/ para refrescar el access token */
export async function refreshToken(refresh: string): Promise<{ access: string }> {
  const response = await axios.post("http://127.0.0.1:8000/api/auth/token/refresh/", {
    refresh,
  });
  return response.data;
}

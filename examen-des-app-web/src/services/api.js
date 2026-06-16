import axios from 'axios';
import { API_BASE_URL } from './config';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos máximo por petición
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, statusText, data } = error.response;
      const detalle =
        (typeof data === 'string' && data) ||
        (data && data.message) ||
        statusText ||
        'Error desconocido';
      return Promise.reject(
        new Error(
          `Error ${status} al consultar la API. ${detalle}. Verifica la URL configurada en src/services/config.js`,
        ),
      );
    }

    if (error.request) {
      // La petición salió pero no hubo respuesta
      return Promise.reject(
        new Error('No se pudo conectar con el servidor (MockAPI). Verifica tu conexión a internet.'),
      );
    }

    // Error al armar la petición
    return Promise.reject(new Error(error.message || 'Error inesperado al consumir la API.'));
  },
);

export async function apiGet(resource) {
  const { data } = await http.get(`/${resource}`);
  return data;
}

export async function apiGetById(resource, id) {
  const { data } = await http.get(`/${resource}/${id}`);
  return data;
}

export async function apiPost(resource, payload) {
  const { data } = await http.post(`/${resource}`, payload);
  return data;
}

export async function apiPut(resource, id, payload) {
  const { data } = await http.put(`/${resource}/${id}`, payload);
  return data;
}

export async function apiDelete(resource, id) {
  const { data } = await http.delete(`/${resource}/${id}`);
  return data;
}
export default http;

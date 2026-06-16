import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, statusText } = error.response;
      return Promise.reject(
        new Error(`Error en la petición: ${status} ${statusText}`),
      );
    }
    return Promise.reject(
      new Error('No se pudo conectar con el servidor (MockAPI). Verifica tu conexión a internet.'),
    );
  },
);

async function request(path, options = {}) {
  const { data } = await client.request({ url: path, ...options });
  return data ?? null;
}

export function get(path) {
  return request(path, { method: 'GET' });
}

export function post(path, body) {
  return request(path, { method: 'POST', data: body });
}

export function put(path, body) {
  return request(path, { method: 'PUT', data: body });
}

export function del(path) {
  return request(path, { method: 'DELETE' });
}

export default client;

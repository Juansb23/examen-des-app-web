import { apiDelete, apiGet, apiGetById, apiPost, apiPut } from './api';

const RESOURCE = 'productos';

export async function getProductos() {
  return apiGet(RESOURCE);
}

export async function getProductoById(id) {
  return apiGetById(RESOURCE, id);
}

export async function crearProducto(producto) {
  return apiPost(RESOURCE, producto);
}

export async function actualizarProducto(id, producto) {
  return apiPut(RESOURCE, id, producto);
}

export async function eliminarProducto(id) {
  return apiDelete(RESOURCE, id);
}

import { apiDelete, apiGet, apiGetById, apiPost, apiPut } from './api';

const RESOURCE = 'usuarios';

export async function getUsuarios() {
  return apiGet(RESOURCE);
}

export async function getUsuarioById(id) {
  return apiGetById(RESOURCE, id);
}

export async function crearUsuario(usuario) {
  return apiPost(RESOURCE, usuario);
}

export async function actualizarUsuario(id, usuario) {
  return apiPut(RESOURCE, id, usuario);
}

export async function eliminarUsuario(id) {
  return apiDelete(RESOURCE, id);
}

export async function validarCredenciales(usuario, password) {
  const usuarios = await getUsuarios();

  return usuarios.find(
    (item) =>
      String(item.usuario).trim().toLowerCase() === usuario.trim().toLowerCase() &&
      String(item.password) === password,
  );
}

export async function existeUsuario(usuario) {
  const usuarios = await getUsuarios();
  return usuarios.some(
    (item) => String(item.usuario).trim().toLowerCase() === usuario.trim().toLowerCase(),
  );
}

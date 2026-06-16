import { reactive } from 'vue';
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  existeUsuario,
  getUsuarios,
} from '../services/userService';

export const usersState = reactive({
  items: [],
  loading: false,
  error: '',
});

function normalizeUsuario(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre || '',
    usuario: usuario.usuario || '',
    password: usuario.password || '',
    rol: usuario.rol || 'user',
    email: usuario.email || '',
  };
}

export async function fetchUsuarios() {
  usersState.loading = true;
  usersState.error = '';

  try {
    const data = await getUsuarios();
    usersState.items = (data || []).map(normalizeUsuario);
  } catch (err) {
    usersState.error = err.message || 'No se pudieron cargar los usuarios.';
  } finally {
    usersState.loading = false;
  }
}

export async function addUsuario(usuario) {
  const nombreUsuario = usuario.usuario.trim();
  const yaExiste = await existeUsuario(nombreUsuario);

  if (yaExiste) {
    throw new Error('Ya existe un usuario con ese nombre de usuario.');
  }

  const payload = {
    nombre: usuario.nombre.trim(),
    usuario: nombreUsuario,
    password: usuario.password.trim(),
    rol: usuario.rol || 'user',
    email: usuario.email?.trim() || '',
  };

  const created = await crearUsuario(payload);
  usersState.items.push(normalizeUsuario(created));
}

export async function editUsuario(id, usuario) {
  const payload = {
    nombre: usuario.nombre.trim(),
    usuario: usuario.usuario.trim(),
    password: usuario.password.trim(),
    rol: usuario.rol || 'user',
    email: usuario.email?.trim() || '',
  };

  const updated = await actualizarUsuario(id, payload);
  const index = usersState.items.findIndex((item) => item.id === id);

  if (index !== -1) {
    usersState.items[index] = normalizeUsuario(updated || { id, ...payload });
  }
}

export async function removeUsuario(id) {
  await eliminarUsuario(id);
  usersState.items = usersState.items.filter((item) => item.id !== id);
}

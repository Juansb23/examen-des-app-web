import { reactive } from 'vue';
import { crearUsuario, existeUsuario, validarCredenciales } from '../services/userService';
import { loadCartForUser } from './shopStore';

const TOKEN_KEY = 'coffe-time-token';
const SESSION_KEY = 'coffe-time-session';

function getSession() {
  try {
    const savedSession = localStorage.getItem(SESSION_KEY);
    return savedSession ? JSON.parse(savedSession) : null;
  } catch {
    return null;
  }
}

const currentSession = getSession();

export const authState = reactive({
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)) && Boolean(currentSession),
  currentUser: currentSession,
});

function generarTokenSimulado(usuario) {
  return btoa(`${usuario}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

export async function login(usuario, password) {
  const trimmedUser = usuario.trim();
  const trimmedPassword = password.trim();

  const foundUser = await validarCredenciales(trimmedUser, trimmedPassword);

  if (!foundUser) {
    return { ok: false, message: 'Usuario o contraseña incorrectos.' };
  }

  const session = {
    id: foundUser.id,
    nombre: foundUser.nombre || foundUser.usuario,
    usuario: foundUser.usuario,
    rol: foundUser.rol || 'user',
  };

  const token = generarTokenSimulado(session.usuario);

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  authState.isAuthenticated = true;
  authState.currentUser = session;
  loadCartForUser(session.usuario);

  return { ok: true };
}

export async function register(usuario, password, nombre) {
  const trimmedUser = usuario.trim();
  const trimmedPassword = password.trim();

  const yaExiste = await existeUsuario(trimmedUser);

  if (yaExiste) {
    return { ok: false, message: 'Ese usuario ya existe.' };
  }

  await crearUsuario({
    nombre: nombre?.trim() || trimmedUser,
    usuario: trimmedUser,
    password: trimmedPassword,
    rol: 'user',
    email: '',
  });

  return { ok: true, message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.' };
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  authState.isAuthenticated = false;
  authState.currentUser = null;
  loadCartForUser(null);
}

export function isAdmin() {
  return authState.currentUser?.rol === 'admin';
}

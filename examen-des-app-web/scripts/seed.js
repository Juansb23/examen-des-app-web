import axios from 'axios';
import { API_BASE_URL } from '../src/services/config.js';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

const usuarios = [
  {
    nombre: 'Administrador',
    usuario: 'Coffe',
    password: '2026',
    rol: 'admin',
    email: 'admin@coffetime.com',
  },
  {
    nombre: 'Usuario Demo',
    usuario: 'demo',
    password: '1234',
    rol: 'user',
    email: 'demo@coffetime.com',
  },
];

const productos = [
  { nombre: 'Café Americano', precio: 7000, descripcion: 'Café negro clásico, intenso y aromático.', imagen: 'cafe1.jpg' },
  { nombre: 'Café Latte', precio: 7000, descripcion: 'Suave mezcla de café con leche cremosa.', imagen: 'cafe2.jpg' },
  { nombre: 'Capuccino', precio: 8000, descripcion: 'Espuma perfecta con toque de canela.', imagen: 'cafe3.jpg' },
  { nombre: 'Café Mocca', precio: 10000, descripcion: 'Café con chocolate, dulce y delicioso.', imagen: 'cafe4.jpg' },
  { nombre: 'Espresso', precio: 6000, descripcion: 'Café fuerte y concentrado.', imagen: 'cafe5.jpg' },
  { nombre: 'Café Frappé', precio: 10000, descripcion: 'Refrescante, espumoso y frío.', imagen: 'cafe6.jpg' },
  { nombre: 'Café Mocaccino', precio: 11000, descripcion: 'Café espresso con leche vaporizada y chocolate.', imagen: 'cafe7.jpg' },
  { nombre: 'Café Flat White', precio: 12000, descripcion: 'Sabor intenso a espresso con textura cremosa.', imagen: 'cafe8.jpg' },
  { nombre: 'Café Prensado', precio: 10000, descripcion: 'Café con cuerpo completo preparado en prensa francesa.', imagen: 'cafe9.jpg' },
  { nombre: 'Chocolate Caliente', precio: 5000, descripcion: 'Chocolate caliente, cremoso y delicioso.', imagen: 'cafe10.jpg' },
];

async function seed(resource, items) {
  for (const item of items) {
    try {
      const { data } = await http.post(`/${resource}`, item);
      console.log(`✔ ${resource} -> creado:`, data.nombre || data.usuario);
    } catch (error) {
      const status = error.response?.status ?? 'sin respuesta';
      const detalle = error.response?.data ?? error.message;
      console.error(`✗ Error creando en "${resource}":`, status, detalle);
    }
  }
}

(async () => {
  console.log(`Usando API_BASE_URL: ${API_BASE_URL}`);
  console.log('\n--- Creando usuarios ---');
  await seed('usuarios', usuarios);

  console.log('\n--- Creando productos ---');
  await seed('productos', productos);

  console.log('\nListo. Ya puedes iniciar sesión con:');
  console.log('  Usuario: Coffe  /  Contraseña: 2026  (rol admin)');
  console.log('  Usuario: demo   /  Contraseña: 1234  (rol user)');
})();

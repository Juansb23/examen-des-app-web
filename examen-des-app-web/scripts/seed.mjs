import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import { API_BASE_URL } from '../src/services/apiConfig.js';

const productosPath = fileURLToPath(new URL('../data/productos.json', import.meta.url));
const productos = JSON.parse(readFileSync(productosPath, 'utf-8'));

const usuarios = [
  {
    nombre: 'Administrador',
    usuario: 'Coffe',
    contrasena: '2026',
    correo: 'admin@coffetime.com',
    rol: 'admin',
  },
  {
    nombre: 'Usuario Demo',
    usuario: 'demo',
    contrasena: 'demo123',
    correo: 'demo@coffetime.com',
    rol: 'user',
  },
];

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

async function seedResource(resource, items) {
  for (const item of items) {
    const { id, ...payload } = item;

    try {
      const { data: created } = await http.post(`/${resource}`, payload);
      console.log(`✓ ${resource} -> id ${created.id}: ${created.nombre || created.usuario}`);
    } catch (error) {
      const status = error.response?.status ?? 'sin respuesta';
      const detalle = error.response?.data ?? error.message;
      console.error(`✗ Error creando registro en "${resource}":`, status, detalle);
    }
  }
}

async function main() {
  if (API_BASE_URL.includes('REEMPLAZA-ESTO')) {
    console.error(
      '✗ Debes configurar tu URL real de MockAPI en src/services/apiConfig.js antes de ejecutar este script.',
    );
    process.exit(1);
  }

  console.log('Sembrando usuarios...');
  await seedResource('usuarios', usuarios);

  console.log('\nSembrando productos...');
  await seedResource('productos', productos);

  console.log('\n¡Listo! Ya puedes iniciar sesión con usuario "Coffe" y contraseña "2026".');
}

main();

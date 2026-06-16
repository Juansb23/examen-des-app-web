import { reactive } from 'vue';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  getProductos,
} from '../services/productService';

export const productsState = reactive({
  items: [],
  loading: false,
  error: '',
});

function normalizeProducto(producto) {
  return {
    id: producto.id,
    nombre: producto.nombre || 'Producto sin nombre',
    descripcion: producto.descripcion || '',
    precio: Number(producto.precio) || 0,
    imagen: producto.imagen || 'cafe1.jpg',
  };
}

export async function fetchProductos() {
  productsState.loading = true;
  productsState.error = '';

  try {
    const data = await getProductos();
    productsState.items = (data || []).map(normalizeProducto);
  } catch (err) {
    productsState.error = err.message || 'No se pudieron cargar los productos.';
  } finally {
    productsState.loading = false;
  }
}

export async function addProducto(producto) {
  const payload = {
    nombre: producto.nombre.trim(),
    descripcion: producto.descripcion.trim(),
    precio: Number(producto.precio),
    imagen: producto.imagen || 'cafe1.jpg',
  };

  const created = await crearProducto(payload);
  productsState.items.push(normalizeProducto(created));
}

export async function editProducto(id, producto) {
  const payload = {
    nombre: producto.nombre.trim(),
    descripcion: producto.descripcion.trim(),
    precio: Number(producto.precio),
    imagen: producto.imagen || 'cafe1.jpg',
  };

  const updated = await actualizarProducto(id, payload);
  const index = productsState.items.findIndex((item) => item.id === id);

  if (index !== -1) {
    productsState.items[index] = normalizeProducto(updated || { id, ...payload });
  }
}

export async function removeProducto(id) {
  await eliminarProducto(id);
  productsState.items = productsState.items.filter((item) => item.id !== id);
}

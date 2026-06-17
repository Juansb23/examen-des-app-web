import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import ProductsView from '../views/ProductsView.vue';
import UsersView from '../views/UsersView.vue';
import CartView from '../views/CartView.vue';
import { authState } from '../stores/authStore';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/',
    name: 'products',
    component: ProductsView,
  },
  {
    path: '/usuarios',
    name: 'users',
    component: UsersView,
    meta: { adminOnly: true },
  },
  {
    path: '/carrito',
    name: 'cart',
    component: CartView,
    meta: { userOnly: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  // 1. Rutas privadas requieren autenticación
  if (!to.meta.public && !authState.isAuthenticated) {
    return { name: 'login' };
  }

  // 2. Si ya está autenticado y va al login, redirigir al inicio
  if (to.name === 'login' && authState.isAuthenticated) {
    return { name: 'products' };
  }

  // 3. Rutas marcadas como adminOnly: solo accesibles para el rol admin
  if (to.meta.adminOnly && authState.currentUser?.rol !== 'admin') {
    return { name: 'products' };
  }

  // 4. Rutas marcadas como userOnly: el admin no compra, así que se le
  // redirige al catálogo si intenta acceder al carrito por URL.
  if (to.meta.userOnly && authState.currentUser?.rol === 'admin') {
    return { name: 'products' };
  }

  return true;
});

export default router;

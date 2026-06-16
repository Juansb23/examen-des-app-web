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
  },
  {
    path: '/carrito',
    name: 'cart',
    component: CartView,
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
  if (!to.meta.public && !authState.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.name === 'login' && authState.isAuthenticated) {
    return { name: 'products' };
  }

  return true;
});

export default router;

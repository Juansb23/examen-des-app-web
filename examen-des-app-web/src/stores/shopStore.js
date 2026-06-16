import { computed, reactive } from 'vue';

const CART_KEY = 'coffe-time-cart';
const SESSION_KEY = 'coffe-time-session';

function getSessionUser() {
  try {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (!savedSession) return null;
    return JSON.parse(savedSession)?.usuario || null;
  } catch {
    return null;
  }
}

function normalizeUserKey(user) {
  return encodeURIComponent(user.trim().toLowerCase());
}

let activeCartUser = getSessionUser();

function getCartKey() {
  return activeCartUser ? `${CART_KEY}-${normalizeUserKey(activeCartUser)}` : CART_KEY;
}

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export const shopState = reactive({
  cart: activeCartUser ? readStorage(getCartKey(), []) : [],
});

export const cartTotal = computed(() =>
  shopState.cart.reduce((total, item) => total + item.precio * item.cantidad, 0),
);

export const cartItemsCount = computed(() =>
  shopState.cart.reduce((total, item) => total + item.cantidad, 0),
);

function persistCart() {
  if (!activeCartUser) return;
  localStorage.setItem(getCartKey(), JSON.stringify(shopState.cart));
}

export function loadCartForUser(user) {
  activeCartUser = user;
  shopState.cart = activeCartUser ? readStorage(getCartKey(), []) : [];
}

export function addToCart(product) {
  const existing = shopState.cart.find((item) => item.id === product.id);

  if (existing) {
    existing.cantidad += 1;
  } else {
    shopState.cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: Number(product.precio) || 0,
      cantidad: 1,
    });
  }

  persistCart();
}

export function decrementCartItem(productId) {
  const item = shopState.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.cantidad -= 1;
  if (item.cantidad <= 0) {
    removeCartItem(productId);
    return;
  }

  persistCart();
}

export function removeCartItem(productId) {
  shopState.cart = shopState.cart.filter((item) => item.id !== productId);
  persistCart();
}

export function clearCart() {
  shopState.cart = [];
  persistCart();
}

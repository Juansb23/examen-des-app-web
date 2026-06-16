<template>
  <section class="container-fluid py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <p class="text-uppercase small fw-semibold text-secondary mb-1">Compra</p>
        <h2 class="h3 mb-0">Carrito</h2>
      </div>
      <RouterLink class="btn btn-outline-secondary" to="/">Seguir comprando</RouterLink>
    </div>

    <div v-if="message" class="alert alert-success">{{ message }}</div>

    <div v-if="shopState.cart.length" class="row g-4">
      <div class="col-12 col-xl-8">
        <div class="d-grid gap-3">
          <CartItem
            v-for="item in shopState.cart"
            :key="item.id"
            :item="item"
            @increment="addToCart"
            @decrement="decrementCartItem"
            @remove="removeCartItem"
          />
        </div>
      </div>

      <aside class="col-12 col-xl-4">
        <div class="summary-panel bg-white rounded-3 shadow-sm p-4">
          <h3 class="h5">Resumen</h3>
          <div class="d-flex justify-content-between border-top pt-3 mt-3">
            <span>Total</span>
            <strong>{{ formatCurrency(cartTotal) }}</strong>
          </div>
          <button class="btn btn-coffee w-100 mt-4" type="button" @click="checkout">Comprar</button>
        </div>
      </aside>
    </div>

    <div v-else class="empty-state text-center bg-white rounded-3 shadow-sm p-5">
      <h3 class="h4">El carrito está vacío</h3>
      <p class="text-secondary">Agrega productos del catálogo para iniciar una compra.</p>
      <RouterLink class="btn btn-coffee" to="/">Ver productos</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import CartItem from '../components/CartItem.vue';
import { addToCart, cartTotal, clearCart, decrementCartItem, removeCartItem, shopState } from '../stores/shopStore';
import { formatCurrency } from '../utils/format';

const message = ref('');

function checkout() {
  clearCart();
  message.value = 'Gracias por tu compra en Coffe Time.';
}
</script>

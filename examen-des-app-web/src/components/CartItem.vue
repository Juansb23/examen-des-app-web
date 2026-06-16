<template>
  <div class="cart-item bg-white rounded-3 shadow-sm p-3">
    <div>
      <h2 class="h6 mb-1">{{ item.nombre }}</h2>
      <p class="mb-0 text-secondary">{{ formatCurrency(item.precio) }} c/u</p>
    </div>

    <div class="d-flex align-items-center gap-2">
      <button class="btn btn-outline-secondary btn-sm" type="button" @click="$emit('decrement', item.id)">-</button>
      <span class="fw-bold quantity-box">{{ item.cantidad }}</span>
      <button class="btn btn-outline-secondary btn-sm" type="button" @click="$emit('increment', item)">+</button>
    </div>

    <strong>{{ formatCurrency(item.precio * item.cantidad) }}</strong>
    <button class="btn btn-outline-danger btn-sm" type="button" @click="$emit('remove', item.id)">
      <i class="bi bi-trash3"></i>
    </button>
  </div>
</template>

<script setup>
import { formatCurrency } from '../utils/format';

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

defineEmits(['increment', 'decrement', 'remove']);
</script>

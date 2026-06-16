<template>
  <article class="card product-card h-100 shadow-sm">
    <img
      :src="imageSrc"
      class="card-img-top product-image"
      :alt="product.nombre"
      @error="onImageError"
    />
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between gap-3">
        <h2 class="h5 card-title mb-2">{{ product.nombre }}</h2>
        <span class="fw-bold text-nowrap">{{ formatCurrency(product.precio) }}</span>
      </div>
      <p class="card-text text-secondary flex-grow-1">{{ product.descripcion }}</p>
      <div class="d-grid gap-2">
        <button v-if="canBuy" class="btn btn-coffee" type="button" @click="$emit('add', product)">
          <i class="bi bi-cart-plus me-1"></i>Agregar al carrito
        </button>
        <div v-if="canManage" class="btn-group" role="group" :aria-label="`Acciones para ${product.nombre}`">
          <button class="btn btn-outline-secondary" type="button" @click="$emit('edit', product)">
            <i class="bi bi-pencil-square me-1"></i>Editar
          </button>
          <button class="btn btn-outline-danger" type="button" @click="$emit('delete', product)">
            <i class="bi bi-trash3 me-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../utils/format';
import { resolveProductImage } from '../utils/productImages';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  canManage: {
    type: Boolean,
    default: false,
  },
  canBuy: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['add', 'edit', 'delete']);

const imageSrc = computed(() => resolveProductImage(props.product.imagen));

// Si la URL externa de la imagen falla (404, dominio caído, etc.),
// se reemplaza por la imagen por defecto para no mostrar un ícono roto.
function onImageError(event) {
  event.target.src = resolveProductImage('');
}
</script>

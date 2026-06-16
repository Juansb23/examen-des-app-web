<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <i class="bi bi-exclamation-triangle-fill text-danger"></i>
            {{ title }}
          </h5>
          <button class="btn-close" type="button" aria-label="Cerrar" @click="$emit('cancel')"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" type="button" @click="$emit('cancel')">
            Cancelar
          </button>
          <button class="btn btn-danger" type="button" @click="$emit('confirm')">
            <i class="bi bi-trash3 me-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Confirmar eliminación',
  },
  message: {
    type: String,
    default: '¿Estás seguro de que deseas eliminar este elemento?',
  },
});

defineEmits(['confirm', 'cancel']);
</script>

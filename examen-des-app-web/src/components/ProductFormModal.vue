<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="productFormTitle">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="productFormTitle" class="modal-title d-flex align-items-center gap-2">
            <i :class="product ? 'bi bi-pencil-square' : 'bi bi-plus-circle-fill'"></i>
            {{ product ? 'Editar café' : 'Nuevo café' }}
          </h5>
          <button class="btn-close" type="button" aria-label="Cerrar" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label" for="productName">Nombre</label>
                <input id="productName" v-model.trim="form.nombre" class="form-control" type="text" required />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="productPrice">Precio</label>
                <input
                  id="productPrice"
                  v-model.number="form.precio"
                  class="form-control"
                  type="number"
                  min="1"
                  required
                />
              </div>

              <div class="col-md-6 d-flex align-items-end">
                <p class="form-text mb-0">
                  <i class="bi bi-info-circle me-1"></i>
                  Pega la URL de una imagen pública (https://...)
                </p>
              </div>

              <div class="col-12">
                <label class="form-label" for="productImage">URL de la imagen</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-image"></i></span>
                  <input
                    id="productImage"
                    v-model.trim="form.imagen"
                    class="form-control"
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                <small class="text-secondary">
                  También puedes usar el nombre de una imagen local (ej: <code>cafe1.jpg</code>).
                </small>
              </div>

              <div class="col-12">
                <label class="form-label">Vista previa</label>
                <div class="border rounded p-2 text-center bg-light">
                  <img
                    :src="previewSrc"
                    alt="Vista previa de la imagen"
                    class="img-fluid rounded"
                    style="width: 100%; height: 200px; object-fit: cover; object-position: center;"
                    @error="onImageError"
                  />
                  <div v-if="imageLoadError" class="small text-danger mt-2">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    No se pudo cargar la imagen. Se mostrará una por defecto.
                  </div>
                </div>
              </div>

              <div class="col-12">
                <label class="form-label" for="productDescription">Descripción</label>
                <textarea
                  id="productDescription"
                  v-model.trim="form.descripcion"
                  class="form-control"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div v-if="error" class="col-12">
                <div class="alert alert-warning mb-0">{{ error }}</div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline-secondary" type="button" @click="$emit('close')">Cancelar</button>
            <button class="btn btn-coffee" type="submit" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { resolveProductImage } from '../utils/productImages';

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'save']);
const error = ref('');
const imageLoadError = ref(false);

const form = reactive({
  nombre: '',
  descripcion: '',
  precio: 0,
  imagen: '',
});

const previewSrc = computed(() => resolveProductImage(form.imagen));

watch(
  () => props.product,
  (product) => {
    form.nombre = product?.nombre || '';
    form.descripcion = product?.descripcion || '';
    form.precio = product?.precio || 0;
    form.imagen = product?.imagen || '';
    error.value = '';
    imageLoadError.value = false;
  },
  { immediate: true },
);

watch(() => form.imagen, () => {
  imageLoadError.value = false;
});

function onImageError(event) {
  imageLoadError.value = true;
  event.target.src = resolveProductImage('');
}

function submitForm() {
  if (!form.nombre || !form.descripcion || Number(form.precio) <= 0) {
    error.value = 'Completa todos los campos con valores válidos.';
    return;
  }

  const imagenFinal = form.imagen?.trim() || 'cafe1.jpg';

  emit('save', {
    ...form,
    imagen: imagenFinal,
    precio: Number(form.precio),
  });
}
</script>

<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="userFormTitle">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="userFormTitle" class="modal-title d-flex align-items-center gap-2">
            <i :class="user ? 'bi bi-pencil-square' : 'bi bi-person-plus-fill'"></i>
            {{ user ? 'Editar usuario' : 'Nuevo usuario' }}
          </h5>
          <button class="btn-close" type="button" aria-label="Cerrar" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label" for="userNombre">Nombre completo</label>
                <input
                  id="userNombre"
                  v-model.trim="form.nombre"
                  class="form-control"
                  type="text"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="userUsuario">Usuario</label>
                <input
                  id="userUsuario"
                  v-model.trim="form.usuario"
                  class="form-control"
                  type="text"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="userPassword">Contraseña</label>
                <input
                  id="userPassword"
                  v-model.trim="form.password"
                  class="form-control"
                  type="text"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="userRol">Rol</label>
                <select id="userRol" v-model="form.rol" class="form-select">
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="userEmail">Correo (opcional)</label>
                <input id="userEmail" v-model.trim="form.email" class="form-control" type="email" />
              </div>

              <div v-if="error" class="col-12">
                <div class="alert alert-warning mb-0">{{ error }}</div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline-secondary" type="button" @click="$emit('close')">
              Cancelar
            </button>
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
import { reactive, ref, watch } from 'vue';

const props = defineProps({
  user: {
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

const form = reactive({
  nombre: '',
  usuario: '',
  password: '',
  rol: 'user',
  email: '',
});

watch(
  () => props.user,
  (user) => {
    form.nombre = user?.nombre || '';
    form.usuario = user?.usuario || '';
    form.password = user?.password || '';
    form.rol = user?.rol || 'user';
    form.email = user?.email || '';
    error.value = '';
  },
  { immediate: true },
);

function submitForm() {
  if (!form.nombre || !form.usuario || !form.password) {
    error.value = 'Completa los campos obligatorios (nombre, usuario y contraseña).';
    return;
  }

  emit('save', { ...form });
}
</script>

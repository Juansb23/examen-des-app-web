<template>
  <main class="login-page">
    <section class="login-card">
      <p class="text-uppercase small fw-semibold mb-1">Coffe Time</p>
      <h1 class="h3 mb-4">{{ isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión' }}</h1>

      <form class="d-grid gap-3" @submit.prevent="handleSubmit">
        <div v-if="isRegisterMode">
          <label class="form-label" for="nombre">Nombre completo</label>
          <input id="nombre" v-model="nombre" class="form-control" type="text" autocomplete="name" />
        </div>

        <div>
          <label class="form-label" for="user">Usuario</label>
          <input id="user" v-model="user" class="form-control" type="text" autocomplete="username" />
        </div>

        <div>
          <label class="form-label" for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            class="form-control"
            type="password"
            :autocomplete="isRegisterMode ? 'new-password' : 'current-password'"
          />
        </div>

        <div v-if="isRegisterMode">
          <label class="form-label" for="confirmPassword">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            class="form-control"
            type="password"
            autocomplete="new-password"
          />
        </div>

        <div v-if="message" class="alert mb-0" :class="messageClass">{{ message }}</div>

        <button class="btn btn-coffee btn-lg" type="submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ submitText }}
        </button>

        <button class="btn btn-link login-switch" type="button" @click="toggleMode">
          {{ isRegisterMode ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, register } from '../stores/authStore';

const router = useRouter();
const nombre = ref('');
const user = ref('');
const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const status = ref('info');
const isLoading = ref(false);
const isRegisterMode = ref(false);

const messageClass = computed(() => ({
  'alert-warning': status.value === 'warning',
  'alert-danger': status.value === 'danger',
  'alert-success': status.value === 'success',
}));

const submitText = computed(() => {
  if (isLoading.value) {
    return isRegisterMode.value ? 'Creando...' : 'Verificando...';
  }

  return isRegisterMode.value ? 'Crear cuenta' : 'Ingresar';
});

function resetForm() {
  nombre.value = '';
  user.value = '';
  password.value = '';
  confirmPassword.value = '';
  message.value = '';
  status.value = 'info';
  isLoading.value = false;
}

function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value;
  resetForm();
}

function handleSubmit() {
  message.value = '';

  if (!user.value.trim() || !password.value.trim()) {
    status.value = 'warning';
    message.value = 'Todos los campos son obligatorios.';
    return;
  }

  if (isRegisterMode.value) {
    handleRegister();
    return;
  }

  handleLogin();
}

async function handleLogin() {
  isLoading.value = true;

  try {
    const result = await login(user.value, password.value);

    if (result.ok) {
      status.value = 'success';
      message.value = 'Bienvenido.';
      router.push({ name: 'products' });
      return;
    }

    status.value = 'danger';
    message.value = result.message;
  } catch (err) {
    status.value = 'danger';
    message.value = err.message || 'No se pudo conectar con la API. Intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}

async function handleRegister() {
  if (!nombre.value.trim()) {
    status.value = 'warning';
    message.value = 'El nombre completo es obligatorio.';
    return;
  }

  if (!confirmPassword.value.trim()) {
    status.value = 'warning';
    message.value = 'Debes confirmar la contraseña.';
    return;
  }

  if (password.value.trim().length < 4) {
    status.value = 'warning';
    message.value = 'La contraseña debe tener al menos 4 caracteres.';
    return;
  }

  if (password.value.trim() !== confirmPassword.value.trim()) {
    status.value = 'danger';
    message.value = 'Las contraseñas no coinciden.';
    return;
  }

  isLoading.value = true;

  try {
    const result = await register(user.value, password.value, nombre.value);
    status.value = result.ok ? 'success' : 'danger';
    message.value = result.message;

    if (result.ok) {
      isRegisterMode.value = false;
      password.value = '';
      confirmPassword.value = '';
    }
  } catch (err) {
    status.value = 'danger';
    message.value = err.message || 'No se pudo conectar con la API. Intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}
</script>

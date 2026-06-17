<template>
  <section class="container-fluid py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <p class="text-uppercase small fw-semibold text-secondary mb-1">Administración</p>
        <h2 class="h3 mb-0">Usuarios</h2>
      </div>
      <button v-if="canManageUsers" class="btn btn-coffee" type="button" @click="openCreateModal">
        <i class="bi bi-plus-lg me-1"></i>Nuevo usuario
      </button>
    </div>

    <div v-if="alertMessage" class="alert alert-dismissible fade show" :class="alertClass" role="alert">
      {{ alertMessage }}
      <button class="btn-close" type="button" aria-label="Cerrar" @click="alertMessage = ''"></button>
    </div>

    <div v-if="usersState.error" class="alert alert-danger" role="alert">
      <i class="bi bi-wifi-off me-2"></i>{{ usersState.error }}
    </div>

    <div v-if="usersState.loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle bg-white shadow-sm rounded">
        <thead class="table-light">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Usuario</th>
            <th scope="col">Correo</th>
            <th scope="col">Rol</th>
            <th scope="col" class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersState.items" :key="user.id">
            <td>{{ user.nombre }}</td>
            <td>{{ user.usuario }}</td>
            <td>{{ user.email || '—' }}</td>
            <td>
              <span class="badge" :class="user.rol === 'admin' ? 'text-bg-coffee' : 'text-bg-secondary'">
                {{ user.rol === 'admin' ? 'Administrador' : 'Usuario' }}
              </span>
            </td>
            <td class="text-end">
              <div v-if="canManageUsers" class="btn-group" role="group" :aria-label="`Acciones para ${user.nombre}`">
                <button class="btn btn-outline-secondary btn-sm" type="button" title="Editar" @click="openEditModal(user)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" type="button" title="Eliminar" @click="askDelete(user)">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
              <span v-else class="text-secondary small">
                <i class="bi bi-eye me-1"></i>Solo lectura
              </span>
            </td>
          </tr>
          <tr v-if="usersState.items.length === 0">
            <td colspan="5" class="text-center text-secondary py-4">No hay usuarios registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserFormModal
      v-if="isFormOpen"
      :user="selectedUser"
      :is-saving="isSaving"
      @close="closeForm"
      @save="saveUser"
    />

    <ConfirmModal
      v-if="userToDelete"
      title="Eliminar usuario"
      :message="`¿Deseas eliminar al usuario '${userToDelete.nombre}'? Esta acción no se puede deshacer.`"
      @cancel="userToDelete = null"
      @confirm="deleteUser"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import UserFormModal from '../components/UserFormModal.vue';
import { authState } from '../stores/authStore';
import { addUsuario, editUsuario, fetchUsuarios, removeUsuario, usersState } from '../stores/usersStore';

const isFormOpen = ref(false);
const selectedUser = ref(null);
const userToDelete = ref(null);
const isSaving = ref(false);
const alertMessage = ref('');
const alertClass = ref('alert-success');

// Solo el administrador puede crear, editar o eliminar usuarios.
// Los usuarios normales tienen acceso de solo lectura (en caso de
// llegar a esta vista por algún medio, aunque la ruta también los bloquea).
const canManageUsers = computed(() => authState.currentUser?.rol === 'admin');

onMounted(() => {
  fetchUsuarios();
});

function openCreateModal() {
  if (!canManageUsers.value) return;
  selectedUser.value = null;
  isFormOpen.value = true;
}

function openEditModal(user) {
  if (!canManageUsers.value) return;
  selectedUser.value = { ...user };
  isFormOpen.value = true;
}

function closeForm() {
  isFormOpen.value = false;
  selectedUser.value = null;
}

function showAlert(message, type = 'success') {
  alertMessage.value = message;
  alertClass.value = type === 'success' ? 'alert-success' : 'alert-danger';
}

async function saveUser(userData) {
  isSaving.value = true;

  try {
    if (selectedUser.value?.id) {
      await editUsuario(selectedUser.value.id, userData);
      showAlert('Usuario actualizado correctamente.');
    } else {
      await addUsuario(userData);
      showAlert('Usuario creado correctamente.');
    }
    closeForm();
  } catch (err) {
    showAlert(err.message || 'Ocurrió un error al guardar el usuario.', 'danger');
  } finally {
    isSaving.value = false;
  }
}

function askDelete(user) {
  if (!canManageUsers.value) return;
  userToDelete.value = user;
}

async function deleteUser() {
  try {
    await removeUsuario(userToDelete.value.id);
    showAlert('Usuario eliminado correctamente.');
  } catch (err) {
    showAlert(err.message || 'Ocurrió un error al eliminar el usuario.', 'danger');
  } finally {
    userToDelete.value = null;
  }
}
</script>

<template>
  <section class="container-fluid py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <p class="text-uppercase small fw-semibold text-secondary mb-1">Catálogo</p>
        <h2 class="h3 mb-0">Nuestros productos</h2>
      </div>
      <button v-if="canManageProducts" class="btn btn-coffee" type="button" @click="openCreateModal">
        <i class="bi bi-plus-lg me-1"></i>Nuevo producto
      </button>
    </div>

    <div v-if="alertMessage" class="alert alert-dismissible fade show" :class="alertClass" role="alert">
      {{ alertMessage }}
      <button class="btn-close" type="button" aria-label="Cerrar" @click="alertMessage = ''"></button>
    </div>

    <div v-if="productsState.error" class="alert alert-danger" role="alert">
      <i class="bi bi-wifi-off me-2"></i>{{ productsState.error }}
    </div>

    <div v-if="productsState.loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="row g-4">
      <div v-for="product in productsState.items" :key="product.id" class="col-12 col-sm-6 col-xl-4">
        <ProductCard
          :product="product"
          :can-manage="canManageProducts"
          :can-buy="canBuyProducts"
          @add="handleAddToCart"
          @edit="openEditModal"
          @delete="askDelete"
        />
      </div>

      <div v-if="productsState.items.length === 0" class="col-12 text-center text-secondary py-4">
        No hay productos para mostrar.
      </div>
    </div>

    <ProductFormModal
      v-if="isFormOpen"
      :product="selectedProduct"
      :is-saving="isSaving"
      @close="closeForm"
      @save="saveProduct"
    />

    <ConfirmModal
      v-if="productToDelete"
      title="Eliminar producto"
      :message="`¿Deseas eliminar '${productToDelete.nombre}'? También se quitará del carrito.`"
      @cancel="productToDelete = null"
      @confirm="deleteProduct"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import ProductCard from '../components/ProductCard.vue';
import ProductFormModal from '../components/ProductFormModal.vue';
import { isAdmin } from '../stores/authStore';
import { addProducto, editProducto, fetchProductos, productsState, removeProducto } from '../stores/productsStore';
import { addToCart, removeCartItem } from '../stores/shopStore';

const isFormOpen = ref(false);
const selectedProduct = ref(null);
const productToDelete = ref(null);
const isSaving = ref(false);
const alertMessage = ref('');
const alertClass = ref('alert-success');
const canManageProducts = computed(() => isAdmin());
// Los administradores gestionan el catálogo pero no compran;
// el botón "Agregar al carrito" solo se muestra a usuarios no-admin.
const canBuyProducts = computed(() => !isAdmin());

onMounted(() => {
  fetchProductos();
});

function showAlert(message, type = 'success') {
  alertMessage.value = message;
  alertClass.value = type === 'success' ? 'alert-success' : 'alert-danger';
}

function openCreateModal() {
  if (!canManageProducts.value) return;
  selectedProduct.value = null;
  isFormOpen.value = true;
}

function openEditModal(product) {
  if (!canManageProducts.value) return;
  selectedProduct.value = { ...product };
  isFormOpen.value = true;
}

function closeForm() {
  isFormOpen.value = false;
  selectedProduct.value = null;
}

async function saveProduct(productData) {
  isSaving.value = true;

  try {
    if (selectedProduct.value?.id) {
      await editProducto(selectedProduct.value.id, productData);
      showAlert('Producto actualizado correctamente.');
    } else {
      await addProducto(productData);
      showAlert('Producto creado correctamente.');
    }
    closeForm();
  } catch (err) {
    showAlert(err.message || 'Ocurrió un error al guardar el producto.', 'danger');
  } finally {
    isSaving.value = false;
  }
}

function handleAddToCart(product) {
  addToCart(product);
  showAlert(`${product.nombre} agregado al carrito.`);
}

function askDelete(product) {
  if (!canManageProducts.value) return;
  productToDelete.value = product;
}

async function deleteProduct() {
  try {
    const id = productToDelete.value.id;
    await removeProducto(id);
    removeCartItem(id);
    showAlert('Producto eliminado correctamente.');
  } catch (err) {
    showAlert(err.message || 'Ocurrió un error al eliminar el producto.', 'danger');
  } finally {
    productToDelete.value = null;
  }
}
</script>

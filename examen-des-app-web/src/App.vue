<template>
  <div class="app-shell">
    <AppNavigation v-if="isAuthenticated" />
    <div class="page-shell" :class="{ 'with-navigation': isAuthenticated }">
      <AppHeader v-if="isAuthenticated" />
      <main class="page-content">
        <RouterView />
      </main>
      <AppFooter v-if="isAuthenticated" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import AppNavigation from './components/AppNavigation.vue';
import { authState } from './stores/authStore';

const isAuthenticated = computed(() => authState.isAuthenticated);
</script>

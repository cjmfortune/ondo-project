<script setup lang="ts">
  import Footer from './components/FooterView.vue'
</script>

<template>
  <nav style="margin-bottom: 1rem;">
    <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <RouterView />
  <Footer />
</template>

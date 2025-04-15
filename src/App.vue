<script setup lang="ts">
  import Title from "./components/Title.vue";
  import Footer from './components/FooterView.vue'
</script>

<template>
  <Header class="header">
    <Title />
    <nav class="nav">
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </Header>

  <Main>
    <RouterView />
  </Main>
  <Footer>
    <Footer />
  </Footer>
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav a.router-link-active {
  color: #42b983;
}
</style>

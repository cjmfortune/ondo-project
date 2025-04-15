<script setup lang="ts">
  import Title from "./components/Title.vue";
  import Footer from './components/FooterView.vue'
</script>

<template>
  <Header class="header">
    <Title />
    <nav class="nav">
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/work">Work</RouterLink>
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* 뷰포트 기준 전체 너비 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  box-sizing: border-box; /* padding 포함해서 꽉 채우기 */

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
</style>

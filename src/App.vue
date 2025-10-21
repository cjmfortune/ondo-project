<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Title from "@/components/Title.vue";
import FooterView from "./components/FooterView.vue";

const route = useRoute();

// 현재 경로에 따라 메뉴를 동적으로 설정
const menuItems = computed(() => {
  if (route.path === "/") {
    return [
      { name: "ABOUT", path: "/about" },
      { name: "WORK", path: "/work" },
    ];
  }
  if (route.path === "/about") {
    return [
      { name: "NEWS", path: "/news" },
      { name: "PEOPLE", path: "/people" },
    ];
  }
  if (route.path === "/people"||route.path === "/news") {
    return [
      { name: "NEWS", path: "/news" },
      { name: "PEOPLE", path: "/people" },
    ];
  }
  return [

  ];
});
</script>

<template>

  <Header class="header">
    <Title />
    <nav class="nav">
      <RouterLink
          v-for="menu in menuItems"
          :key="menu.name"
          :to="menu.path"
      >
        {{ menu.name }}
      </RouterLink>
    </nav>
  </Header>

  <Main class="main">
    <RouterView />
  </Main>
  <Footer>
    <FooterView />
  </Footer>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 2rem;
  box-sizing: border-box;
  background: white;
}
.main{
  margin-top: 5rem;
  padding: 2rem;
  box-sizing: border-box;
}
.nav {
  display: flex;
  gap: 1rem;
  font-size: 3.5rem;
  font-weight: bold;
  text-align: center;
  color: #333;
}
@media (max-width: 600px) {
  .nav {
    font-size: 1rem;
  }
}

.nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
footer {
  width: 100%;
  height: 2rem;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
}
</style>
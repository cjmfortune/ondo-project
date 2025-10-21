<script setup lang="ts">
</script>

<template>
  <div class="about-container">
    <div class="column">
      <p>Ondo Project is a Seoul-based architectural practice founded by Ja Kyung Kim in 2018.</p>
      <p>The practice has been working on a wide range of arts, cultural, commercial and residential projects.</p>
      <p>Recently completed work Tulip House in Yangpyeong, and SinbakHanam(residence) in Hanam. Current projects include Gonjang project (Shinyoung LTD) Factory and Office building in Cheonan and a materplan for Glamping in Hongcheon.</p>
    </div>
    <div class="column">
      <div>
        <h3>Ondo Project</h3>
        <address>
          Seoul, Gangnam-gu<br />
          Hakdongno 177, 5th<br />
          06046
        </address>
        <p>
          <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Link to Map</a>
        </p>
        <p>
          <a href="tel:+8225461775">+82 (0)2 546 1775</a>
        </p>
        <p>
          General enquiries: <a href="mailto:ondo@ondo-project.com">ondo@ondo-project.com</a>
        </p>
        <p>
          Instagram: <a href="https://www.instagram.com/ondoproject.official" target="_blank" rel="noopener noreferrer">@ondoproject.official</a>
        </p>
      </div>


    </div>
    <div class="column">

    </div>
  </div>
</template>

<style scoped>
.about-container {
  display: flex;
  flex-direction: column; /* 기본적으로 세로 방향 */
  gap: 1rem;
}

.column {
  flex: 1;
  padding: 1rem;
  box-sizing: border-box;
  border: 0px solid #ddd;
  text-align: left;
}

@media (min-width: 768px) { /* 화면 너비가 768px 이상일 때 */
  .about-container {
    flex-direction: row; /* 가로 방향으로 변경 */
  }
}
</style>
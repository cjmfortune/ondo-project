<script setup lang="ts">
</script>

<template>
  <div class="about-container">

    <div class="column">
      <h3>Haein Park</h3>
      <p>
        Haein studied architecture at Hongik University and worked at several architectural practices, including Leau Design, iarc architects and ARCH166.<br />
        She has won several competitions and completed various projects.
      </p>

    </div>
    <div class="column">
      <h3>Seungyeon Kang</h3>
      <p>
        Seungyeon graduated at Bucheon University.<br />
        She has been working for interior design with commercial, single and multiple residential projects.
      </p>
    </div>
    <div class="column">
      <h3>Ja Kyung Kim<br />AA Dipl(Hons), ARB, RIBA II</h3>
      <p>
        Ja graduated from Kookmin University of Fine Art in Seoul, before studying architecture at the Architectural Association (AA) School of Architecture in London.<br />
        She had various experiences in London and Seoul before establishing Ondo Project.<br />
        Her works were featured in various publications including the KERB Journal of Landscape Architecture.<br />
        She currently works with artists, designers and different eras for collective projects.<br />
        <br />
        She has been an adjunct professor at Yonsei University and has been directing the Seoul AA Visiting School since 2020.
      </p>
    </div>
    <div class="column">
      <h3>Director</h3>
      <p>Ja Kyung Kim</p>
      <h3>Studio Members</h3>
      <p>
        Haein Park, Seungyeon Kang, Sungchea Kim<br />
        Huijoo Lee, Selin Jung, Sangwon Lee, Hyuna Kim<br />
        & Seungjun O, Jiwon Lee, Kwanwoo
      </p>
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
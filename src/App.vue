<script setup lang="ts">
import Home from '@/pages/Home.vue';

</script>

<template>
  <div class="container">
    <Home></Home>
  </div>
  <footer>
    <p class="footer-links">
      <span class="footer-company">DADALTO TECNOLOGIA LTDA</span>
      <span class="footer-separator">|</span>
      <a href="https://portfolio.dadalto.tec.br" target="_blank">
        <i class="fa-solid fa-globe"></i> https://portfolio.dadalto.tec.br
      </a>
      <span class="footer-separator">|</span>
      <a href="mailto:ffdadalto@gmail.com">
        <i class="fa-solid fa-envelope"></i> ffdadalto@gmail.com
      </a>
    </p>
  </footer>
</template>

<style scoped>
footer {
  text-align: center;
  padding: 16px;
  font-size: 12px;
  color: #888;
  border-top: 1px solid #ddd;
  margin-top: 24px;
}

.footer-company {
  font-weight: 600;
  letter-spacing: 0.05em;
}

.footer-links {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  line-height: 1;
}

.footer-links * {
  vertical-align: middle;
}

.footer-links a {
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #472f92;
}

.footer-separator {
  color: #ccc;
}
</style>

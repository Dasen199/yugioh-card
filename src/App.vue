<template>
  <div class="app-container">
    <YugiohCard />
  </div>
</template>

<script setup>
  import YugiohCard from './components/YugiohCard.vue';
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
    overflow-wrap: break-word;
    -webkit-tap-highlight-color: transparent;
  }

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: var(--default-font-family);
    color: var(--main-color);
    font-size: 14px;
    background-color: #f5f7fa;
  }
  
  .app-container {
    width: 100%;
    min-height: 100vh;
    overflow-y: auto;
    padding-bottom: 30px;
  }
</style>

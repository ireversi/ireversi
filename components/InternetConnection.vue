<template>
  <div v-if="checkWifi" class="bar">test</div>
</template>

<script>
export default {
  computed: {
    checkWifi() {
      if (navigator.onLine) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.bar {
  width: 100%;
  background-color:aqua;
  position: relative;
}
</style>

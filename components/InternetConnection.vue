<template>
  <div v-if="checkWifi" sclass="bar">test</div>
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
    methods: {
      check() {
        console.log("no connection");
      }
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

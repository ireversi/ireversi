<template>
  <div v-if="checkWifi" @click="check()" class="bar">test</div>
</template>

<script>
export default {
  computed: {
    checkWifi() {
      return true;
    },
  },
  methods: {
    check() {
      console.log(this);
    },
  },
};
</script>

<style scoped>
.bar {
  width: 100%;
  background-color:aqua;
  position: relative;
  z-index: 100;
}
</style>

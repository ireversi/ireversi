<template>
  <div v-if="connection" @click="check()" class="bar">Lost Internet Connection</div>
</template>

<script>
export default {
  data() {
    return {
      connection: true,
    };
  },
  methods: {
    check() {
      this.connection = false;
    },
  },
};
</script>

<style scoped>
.bar {
  position: absolute;
  width: 100%;
  background-color:red;
  z-index: 100;
  text-align: center;
}
</style>

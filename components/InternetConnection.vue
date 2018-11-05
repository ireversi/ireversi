<template>
  <div v-if="checkConnection" @click="check()" class="bar">Lost Internet Connection</div>
</template>

<script>
import { mapState } from 'vuex';

export default {

  computed: {
    ...mapState(['offline']),
    checkConnection() {
      return this.offline;
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

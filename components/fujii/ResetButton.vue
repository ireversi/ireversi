<template>
  <div class="reset btn" @click="checkKeyword">Reset</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('practice/fujii/index', ['resetGame']),
    checkKeyword() {
      // eslint-disable-next-line
      const keyword = prompt('キーを入れて下さい');
      this.resetGame(keyword);
    },
  },
};
</script>

<style scoped>
.btn {
  position:fixed;
  cursor: pointer;
  background: #fff;
}


.reset {
  bottom: 20px;
  left: 30%;
  padding: 10px 30px;
}
</style>

<template>
  <div class="main">
    <div class="board">
      <div>
        <div
          class="cell"
          v-for="i in Math.pow(grid, 2)"
          :key="i"
          :style="`width: ${ 100 / grid }%;`"
        >
          <div @click="send(i)">
            <div
              class="piece"
              v-if="getUserId(i)"
            >{{ getUserId(i) }}</div>
          </div>
        </div>
      </div>
    </div>
    <UserSelector
     :current="currentUser"
     :number="number"
     @change="changeCurrentUser"
    />
  </div>
</template>

<script>
import UserSelector from '~/components/kai/UserSelector.vue';

export default {
  components: {
    UserSelector,
  },
  async asyncData(app) {
    const mypath = process.env.KAI_PATH;
    const board = await app.$axios.$get(`${mypath}/board`);
    return {
      mypath,
      board,
      currentUser: 2,
    };
  },
  data() {
    const grid = 30;
    const number = 10;
    return {
      grid,
      number,
    };
  },
  computed: { // computed: データによって一意の値を返すもの
    getUserId() {
      return (i) => {
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half;
        const y = half - Math.floor((i - 1) / this.grid);
        const put = (this.board.find(n => n.x === x && n.y === y) || {}).userId;
        return put;
      };
    },
  },
  methods: {
    async send(i) {
      const half = Math.floor(this.grid / 2);
      const x = ((i - 1) % this.grid) - half;
      const y = half - Math.floor((i - 1) / this.grid);

      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);
      params.append('userId', this.currentUser);

      this.board = await this.$axios.$post(`${this.mypath}/playing`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
    changeCurrentUser(n) {
      this.currentUser = n;
    },
  },
};
</script>

<style scoped>
.main {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  background-color: #009B3B;
}
.board {
  padding-top: 100%;
  position: relative;
}
.board > div {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.cell {
  display: inline-block;
  border: 1px solid #333;
  vertical-align: bottom;
}
.cell > div {
  padding-top: 100%;
  position: relative;
}
.piece {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width: 60%;
  height: 60%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #444;
  font-size: 120%;
  font-weight: bold;
}
</style>

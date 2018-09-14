<template>
  <div class="main">
    <div class="board">
      <div>
        <div
          class="cell"
          v-for="i in Math.pow(grid, 2)"
          :key="i"
          :style="`width: ${100 / grid}%`"
        >
          <!-- <div @click="send(i)"> -->
          <div @click="changeColor(i); send(i)">
            <div
              class="piece"
              v-if="getUserId(i)"
              :style="judgeCurrentUserPiece(i)
                ? `background-color: ${colors[i]}; color: #444`
                : 'background-color: #444; color: #ccc'"
            >
              {{ getUserId(i).userId || getUserId(i).userid || getUserId(i).user_id }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <user-selector
      :number="number"
      :current="currentUser"
      @change="changeCurrentUser"

    />
    <button class="test-btn" @click="increment">{{ counter }}</button>
    <color-palette
      :list="colorList"
      :current="currentColorIndex"
      @select="changeColorIndex"
    />
  </div>
                <!-- :style="`
                background-color: ${colors[i]}`" -->
</template>

<script>
import UserSelector from '~/components/ando/UserSelector.vue';
import ColorPalette from '~/components/ando/ColorPalette.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    UserSelector,
    ColorPalette,
  },
  // async asyncData({ app }) {
  //   const mypath = process.env.ANDO_PATH;
  //   const board = await app.$axios.$get(`${mypath}/board`);
  //   // console.log(board)
  //   return {
  //     mypath,
  //     board,
  //   };
  // },
  async fetch({ store }) {
    await store.dispatch('ando/index/getBoard');
  },
  data() {
    const grid = 31;
    const colors = [];

    for (let i = 0; i < grid ** 2; i += 1) {
      colors.push('#fff');
    }

    return {
      grid,
      colors,
      colorList: ['#f00', '#0f0', '#00f', '#fff'],
      currentColorIndex: 2,
      number: 16,
      currentUser: 1,
    };
  },
  mounted() {
    setInterval(async () => {
      // this.board = await this.$axios.$get(`${this.mypath}/board`);
    }, 1000);
  },
  computed: {
    ...mapState('ando/index', [
      'counter',
      'mypath',
      'board',
    ]),
    getUserId() {
      return function test(i) {
        const result = this.board.find(
          p => p.x === ((i - 1) % this.grid) - Math.floor(this.grid / 2)
            && p.y === this.grid - 1 - (Math.floor(this.grid / 2)
                        + Math.floor((i - 1) / this.grid)),
        );
        return result || false;
      };
    },
    judgeCurrentUserPiece() {
      return i => this.getUserId(i).userid === this.currentUser;
    },
  },
  methods: {
    ...mapMutations('ando/index', ['increment']),
    ...mapActions('ando/index', ['putPiece']),
    async send(i) {
      const x = ((i - 1) % this.grid) - Math.floor(this.grid / 2);
      const y = this.grid - 1 - (Math.floor(this.grid / 2) + Math.floor((i - 1) / this.grid));

      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);
      params.append('userId', this.currentUser);
      params.append('userid', this.currentUser);
      params.append('user_id', this.currentUser);

      // this.board = await this.$axios.$post(`${this.mypath}/piece`, params, {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      // });
      this.putPiece(params);
    },
    changeColor(i) {
      // this.colors[i] = '#f00'; // 色変わらない→this直下までしか差分を監視していない
      const newColors = [...this.colors];
      newColors[i] = this.colorList[this.currentColorIndex];
      this.colors = newColors;
    },
    changeCurrentUser(index) {
      this.currentUser = index;
    },
    changeColorIndex(index) {
      // console.log(index);
      this.currentColorIndex = index;
    },
  },
};
</script>

<style scoped>
.test-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  padding: 10px;
  background-color: #ccc;
}

.main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: green;
}

.board {
  padding-top:100%;
  position: relative;
}

.board > div {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  /* background-color: #444; */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  font-size: 120%;
  font-weight: bold;
}

</style>

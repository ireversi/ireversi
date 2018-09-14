<template>
  <div class="main">
    <div class="board">
      <div>
        <div
          class="cell"
          v-for="i in Math.pow(grid,2)"
          :key="i"
          :style="`width:${100 / grid}%`"
        >
          <div @click="putPiece(i)">
            <div
              class="piece"
              v-if="getUserId(i)"
              :style="`background-color: ${colors[i]}`"
              >{{ getUserId(i) }}</div>
          </div>
        </div>
      </div>
    </div>
    <ColorPallette
      :list="colorList"
      :current="currentColorIndex"
      @select="changeColorIndex"
    />
    <UserPanel
      :list="UserList"
      :current="currentUserIndex"
      @select="changeUserIndex"
    />
  </div>
</template>

<script>
import ColorPallette from '~/components/kimura/ColorPallette.vue';
import UserPanel from '~/components/kimura/UserPanel.vue';

export default {
  components: {
    ColorPallette,
    UserPanel,
  },

  async asyncData({ app }) {
    const mypath = process.env.KIMURA_PATH;
    const board = await app.$axios.$get(`${mypath}/board`);
    return {
      board,
      mypath,
    };
  },
  data() {
    const grid = 15;
    const colors = [];
    for (let i = 0; i < grid ** 2; i += 1) {
      colors.push('#fff');
    }

    const users = [];
    // for (let i = 0; i < this.board.length; i += 1) {

    // }

    return {
      grid,
      colors,
      colorList: ['#f00', '#0f0', '#00f', '#fff'],
      currentColorIndex: 1,
      users,
      UserList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      currentUserIndex: 1,
    };
  },

  computed: {
    getUserId() {
      return (i) => {
        const n = i;
        let ans = 0;
        for (let k = 0; k < this.board.length; k += 1) {
          const xPoint = this.board[k].x;
          const yPoint = this.board[k].y;
          const halfLength = Math.floor(this.grid / 2);
          const origin = halfLength * this.grid + halfLength + 1;
          const target = origin - (this.grid * yPoint) + xPoint;
          if (target === n) {
            ans = this.board[k].userId;
          }
        }
        return ans;
      };
    },
  },
  methods: {
    changeColor(i) {
      const newColors = [...this.colors];
      newColors[i] = this.colorList[this.currentColorIndex];
      this.colors = newColors;
    },
    changeColorIndex(index) {
      this.currentColorIndex = index;
    },
    changeUserIndex(index) {
      this.currentUserIndex = index;
    },
    async putPiece(i) {
      const n = i;
      const halfLength = Math.floor(this.grid / 2);
      const origin = halfLength * this.grid + halfLength + 1;
      const x = (n % this.grid) - (origin % this.grid);
      const y = Math.floor((origin + halfLength - n) / this.grid);
      const userId = this.currentUserIndex;

      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);
      params.append('userId', userId);

      this.board = await this.$axios.$post(`${this.mypath}/piece`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
  },
};
</script>

<style>
.main{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  overflow:auto;
  background:rgb(27,145,57);
}

.board{
  padding-top:100%;
  position:relative;
}

.board > div{
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}

.cell{
  display: inline-block;
  border: 1px solid #333;
  vertical-align: bottom;
}

.cell > div {
  padding-top:100%;
  position: relative;
}

.piece{
  position: absolute;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
  border-radius: 50%;
  width:60%;
  height: 60%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #444;
  font-size: 120%;
  font-weight:bold;
}

</style>

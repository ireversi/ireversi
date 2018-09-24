<template>
  <div class="main">
    <div class="board">
      <div><!-- タテヨコ比が崩れないように空のdivを用意する -->
        <div
          class="cell"
          v-for="i in Math.pow(grid, 2)"
          :key="i"
          :style="`width: ${100/grid}%`"
        >
          <div @click="changeColor(i);putPiece(i)">
            <div
              class="piece"
              v-if="getUserId(i)"
              :style="`background-color: ${colors[i - 1]}`"
            >{{ getUserId(i) }}</div>
          </div>
        </div>
      </div>
    </div>
    <ColorPalette
      :list="colorList"
      :current="currentColorIndex"
      @select="changeColorIndex"
    />
  </div>
</template>

<script>
import ColorPalette from '~/components/fujii/ColorPalette.vue';

export default {
  components: {
    ColorPalette,
  },
  async asyncData({ app }) {
    const mypath = process.env.FUJII_PATH;
    const board = await app.$axios.$get(`${mypath}/board`);

    return {
      board,
      mypath,
    };
  },
  data() {
    const grid = 25;
    const colors = [];
    for (let i = 0; i < grid ** 2; i += 1) {
      colors.push('#fff');
    }
    return { // 直接データのリターンで定義して良い
      grid,
      colors,
      colorList: ['#f00', '#0f0', '#00f', '#fff'],
      currentColorIndex: 0,
    };
  },
  computed: {
    getUserId() {
      return (i) => {
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half;
        const y = half - Math.floor((i - 1) / (this.grid));
        return (this.board.find(el => el.x === x && el.y === y) || {}).userId;
      };
    },
  },
  methods: {
    changeColor(i) {
      // this.colors[i] = '#f00';
      // 監視しているのはthisの直下であるcolorsのみ
      const newColors = [...this.colors];
      newColors[i - 1] = this.colorList[this.currentColorIndex];
      this.colors = newColors;
      // console.log(this.colors);
    },
    changeColorIndex(index) {
      this.currentColorIndex = index;
    },
    async putPiece() {
      const x = 1;
      const y = 2;
      const userId = 5;

      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);
      params.append('userId', userId);


      this.board = await this.$axios.$get(`${this.mypath}/board`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
  },
};
</script>

<style>
.main {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:rgb(27,145,57);
}

.board {
  padding-top: 100%; /* 縦横比を維持する方法 */
  position: relative;
}

.board > div {
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}

.cell {
  display: inline-block;
  border: 1px solid #313;
  vertical-align: bottom;
}

.cell > div {
  padding-top:100%;
  position: relative;
}

.piece {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 50%;
  width: 60%;
  height: 60%;
  background: #ccc;
  display:flex;
  justify-content: center;
  align-items: center;
  color:#444;
  font-size:120%;
  font-weight: bold;
}

</style>

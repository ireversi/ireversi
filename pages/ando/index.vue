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
          <div @click="changeColor(i); send(i)">
            <div
              class="piece"
              v-if="getUserId(i)"
              :style="judgeCurrentUserPiece(i)
                ? `background-color: ${colors[i] || '#fff'}; color: #444`
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
  async fetch({ store }) {
    await store.dispatch('ando/index/getBoard');
  },
  mounted() {
    // setInterval(async () => {
    //   this.board = await this.$axios.$get(`${this.mypath}/board`);
    // }, 1000);
  },
  computed: {
    ...mapState('ando/index', [
      'counter',
      'mypath',
      'board',
      'grid',
      'number',
      'currentUser',
      'colors',
      'colorList',
      'currentColorIndex',
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
    ...mapMutations('ando/index', [
      'increment',
      'changeCurrentUser',
      'changeColorIndex',
      'changeColor',
    ]),
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

      this.putPiece(params);
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

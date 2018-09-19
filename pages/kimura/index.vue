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
              :style="`background-color: #fff`"
              >{{ getUserId(i) }}</div>
          </div>
        </div>
      </div>
    </div>
    <UserPanel
      :list="UserList"
      :current="currentUserIndex"
      @select="changeUserIndex"
    />
    <button class="test-btn-zoomin" @click="zoomIn">+</button>
    <button class="test-btn-zoomout" @click="zoomOut">-</button>
  </div>
</template>

<script>
import ColorPallette from '~/components/kimura/ColorPallette.vue';
import UserPanel from '~/components/kimura/UserPanel.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    ColorPallette,
    UserPanel,
  },
  async fetch({ store }) {
    return store.dispatch('kimura/index/getBoard');
  },

  computed: {
    ...mapState('kimura/index', [
      'counter',
      'mypath',
      'board',
      'grid',
      'UserList',
      'colorList',
      'currentUserIndex',
    ]),
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
    ...mapMutations('kimura/index', [
      'increment',
      'setColors',
      'changeUserIndex',
      'zoomIn',
      'zoomOut',
    ]),
    ...mapActions('kimura/index', ['putsPiece']),
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

      this.putsPiece(params);
    },
  },
};
</script>

<style>
.test-btn-zoomin{
  position:fixed;
  bottom:20px;
  left:48%;
  padding:10pt;
}
.test-btn-zoomout{
  position:fixed;
  bottom:20px;
  left:52%;
  padding:10pt;
}
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

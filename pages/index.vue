<template>
  <div class="main"
    @touchstart="setInitPos($event)"
    @mousedown="setInitPos($event)"
    @touchmove="gridMove($event)"
    @mousemove="gridMove($event)"
    @touchend="resetInitPos"
    @touchcancel="resetInitPos"
    @mouseup="resetInitPos"
  >
    <div class="board">
      <div>
        <div
          class="cell"
          v-for="i in gridX * Math.ceil($window.height / ($window.width/gridX))"
          :key="i"
          :style="
          `width: ${$window.width/gridX}px;
          background: ${putAbleCheck(i) ? '#0652DD': ''};
          cursor: ${putAbleCheck(i) ? 'pointer' : ''}`"
        >
          <div @click="send(i)">
            <div
              class="piece"
              v-if="getUserId(i)"
              :style="getUserId(i) === currentUser ? 'background:#444;color:white' : ''"
            >
              {{ getUserId(i) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="score">
      <div>Score</div>
      <div>{{ score }}</div>
    </div>

    <UserSelector
      :number="number"
      :current="currentUser"
      @change="changeCurrentUser"
    />

    <ResetButton v-if="!productionCheck" />
    <button class="minus btn" @click="zoomout"> - </button>
    <button class="plus btn" @click="zoomin"> + </button>
    <div v-if="!productionCheck">
      <button class="btn up" @click="moveUp"> ↑ </button>
      <button class="btn right" @click="moveRight"> → </button>
      <button class="btn down" @click="moveDown"> ↓ </button>
      <button class="btn left" @click="moveLeft"> ← </button>
    </div>
  </div>
</template>

<script>
/* デバッグ用 (最終的に削除予定) */
import UserSelector from '~/components/UserSelector.vue';
import ResetButton from '~/components/ResetButton.vue';
/* デバッグ用 */
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    UserSelector,
    ResetButton,
  },
  async fetch({ store }) {
    await store.dispatch('getBoard');
  },
  mounted() {
    // setInterval(async () => {
    //   this.getBoard();
    // }, this.productionCheck ? 300 : 1000);
  },
  computed: {
    ...mapState([
      'pieces',
      'candidates',
      'standbys',
      'size',
      'score',
      'number',
      'currentUser',
      'gridX',
      'gridY',
      'xHalf',
      'yHalf',
    ]),
    productionCheck() {
      return process.env.NODE_ENV === 'production';
    },
    checkPC() {
      const { userAgent } = navigator;
      if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPod') > -1
          || userAgent.indexOf('Android') > -1) {
        return false;
      }
      return true;
    },
    getUserId() {
      return (i) => {
        const halfGridX = Math.floor(this.gridX / 2);
        const halfGridY = Math.floor(this.gridY / 2);
        const x = ((i - 1) % this.gridX) - halfGridX + this.xHalf;
        const y = halfGridY + this.yHalf - Math.floor((i - 1) / (this.gridY));
        return (this.pieces.find(el => el.x === x && el.y === y) || {}).userId;
      };
    },
    putAbleCheck() {
      return (i) => {
        const halfGridX = Math.floor(this.gridX / 2);
        const halfGridY = Math.floor(this.gridY / 2);
        const x = ((i - 1) % this.gridX) - halfGridX + this.xHalf;
        const y = halfGridY + this.yHalf - Math.floor((i - 1) / (this.gridY));
        return (this.candidates.find(el => el.x === x && el.y === y));
      };
    },
  },
  methods: {
    ...mapMutations(['increment', 'zoomout', 'zoomin', 'changeCurrentUser', 'setHalf', 'moveRight', 'moveLeft', 'moveUp', 'moveDown', 'setInitPos', 'gridMove', 'resetInitPos']),
    ...mapActions(['getBoard', 'putPiece']),
    setGrid() {
      this.gridX = Math.floor(this.$window.width / 30);
      this.gridY = Math.floor(this.$window.height / 30);
    },
    send(i) {
      if (this.putAbleCheck(i)) {
        const halfGridX = Math.floor(this.gridX / 2);
        const halfGridY = Math.floor(this.gridY / 2);
        const x = ((i - 1) % this.gridX) - halfGridX + this.xHalf;
        const y = halfGridY + this.yHalf - Math.floor((i - 1) / (this.gridY));
        this.putPiece({ x, y });
      }
    },
  },
};
</script>

<style>
body {
  user-select: none;
}
</style>


<style scoped>
.btn {
  position:fixed;
  cursor: pointer;
  background: #fff;
}
.btn:hover {
  background: #f77;
  color: #fff;
}

.up {
  top: 20px;
  left: 50%;
  padding: 10px 30px;
}

.left {
  top: 50%;
  left: 20px;
  padding: 30px 10px;
}

.down {
  bottom: 20px;
  left: 50%;
  padding: 10px 30px;
}

.right {
  top: 50%;
  right: 20px;
  padding: 30px 10px;
}

.minus {
  bottom: 20px;
  left: 70%;
  padding: 10px 30px;
}
.plus {
  bottom: 20px;
  left: 80%;
  padding: 10px 30px;
}

.reset {
  bottom: 20px;
  left: 30%;
  padding: 10px 30px;
}

.main {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background: #009432;
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
  border-top: 1px solid #313;
  border-left: 1px solid #313;
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
  background: #fff;
  display:flex;
  justify-content: center;
  align-items: center;
  color:#444;
  font-size:80%;
}

.score {
  position:fixed;
  top:0;
  left:0;
  background: #fff;
  width: 100px;
  border-radius: 5px;
  border: 2px solid #555;
}

.score > div {
  box-sizing: border-box;
  width: 100px;
  height: 48px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 150%;
  border-bottom: 1px solid #555;
}
</style>

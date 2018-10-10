<template>
    <div class="main">
      <div class="board"
      @touchstart="setInitPos($event)"
      @touchmove="gridMove($event)"
      @touchend="resetInitPos">
        <div>
          <div
            class="cell"
            v-for="i in Math.pow(grid, 2)"
            :key="i"
            :style="
            `width: ${100/grid}%;
            background: ${putAbleCheck(i) ? '#0652DD': ''};
            cursor: ${putAbleCheck(i) ? 'pointer' : ''}`"
          >
            <div @click="send(i)">
              <div
              class="piece"
              v-if="getUserId(i)"
              :style="getUserId(i) === currentUser ? 'background:#444;color:white' :''"
              > {{ getUserId(i) }}</div>
            </div>
          </div>
        </div>
      </div>

      <UserSelector
        :number="number"
        :current="currentUser"
        @change="changeCurrentUser"
      />

      <ResetButton />

      <button class="minus btn" @click="zoomout"> - </button>
      <button class="plus btn" @click="zoomin"> + </button>
      <button class="btn up" @click="moveUp"> ↑ </button>
      <button class="btn right" @click="moveRight"> → </button>
      <button class="btn down" @click="moveDown"> ↓ </button>
      <button class="btn left" @click="moveLeft"> ← </button>
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
    setInterval(async () => {
      this.getBoard();
    }, process.env.NODE_ENV === 'production' ? 300 : 1000);
  },
  computed: {
    ...mapState([
      'pieces',
      'candidates',
      'standbys',
      'number',
      'currentUser',
      'grid',
      'xHalf',
      'yHalf',
    ]),
    getUserId() {
      return (i) => {
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half + this.xHalf;
        const y = half + this.yHalf - Math.floor((i - 1) / (this.grid));
        return (this.pieces.find(el => el.x === x && el.y === y) || {}).userId;
      };
    },
    putAbleCheck() {
      return (i) => {
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half + this.xHalf;
        const y = half + this.yHalf - Math.floor((i - 1) / (this.grid));
        return (this.candidates.find(el => el.x === x && el.y === y));
      };
    },
  },
  methods: {
    ...mapMutations(['increment', 'zoomout', 'zoomin', 'changeCurrentUser', 'setHalf', 'moveRight', 'moveLeft', 'moveUp', 'moveDown', 'setInitPos', 'gridMove', 'resetInitPos']),
    ...mapActions(['getBoard', 'putPiece']),
    send(i) {
      if (this.putAbleCheck(i)) {
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half + this.xHalf;
        const y = half + this.yHalf - Math.floor((i - 1) / (this.grid));
        this.putPiece({ x, y });
      }
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
.board {
  padding-top: 100%;
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
  background: #fff;
  display:flex;
  justify-content: center;
  align-items: center;
  color:#444;
  font-size:120%;
  font-weight: bold;
}
</style>

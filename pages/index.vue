<template>
  <div class="main"
  >
    <Modal />
    <div class="board"
    @touchstart="onTouchStart"
    @mousedown="setInitPos"
    @touchmove="onTouchMove"
    @mousemove="gridMove"
    @touchend="resetInitPos"
    @touchcancel="resetInitPos"
    @mouseup="resetInitPos">
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
    <div class="score">
      <div>Score</div>
      <div>{{ score }}</div>
    </div>

    <UserSelector
      :number="number"
      :current="currentUser"
      @change="changeCurrentUser"
    />

    <div v-if="checkPC" class="btns">
      <div class="minus btn" @click="zoomout"> - </div>
      <div class="plus btn" @click="zoomin"> + </div>
    </div>

  </div>
</template>

<script>
/* デバッグ用 (最終的に削除予定) */
import UserSelector from '~/components/UserSelector.vue';
import ResetButton from '~/components/ResetButton.vue';
import Modal from '~/components/Modal.vue';
/* デバッグ用 */
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    UserSelector,
    ResetButton,
    Modal,
  },
  async fetch({ store }) {
    await store.dispatch('getBoard');
  },
  mounted() {
    setInterval(async () => {
      this.getBoard();
    }, this.productionCheck ? 300 : 1000);
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
      'initX', // mousemove時のxHalf起点情報
      'initY',
      'initLen', // ピンチ操作の基準情報
      'initPosX', // mouseXの起点情報
      'initPosY',
      'dragFlg',
    ]),
    productionCheck() {
      return process.env.NODE_ENV === 'production';
    },
    checkPC() {
      const { userAgent } = navigator;
      if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1
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
    ...mapMutations(['increment', 'zoomout', 'zoomin', 'changeCurrentUser', 'setHalf', 'setInitPos', 'gridMove', 'resetInitPos', 'pinchStart', 'pinchMove']),
    ...mapActions(['getBoard', 'putPiece']),
    send(i) {
      if (this.putAbleCheck(i)) {
        const halfGridX = Math.floor(this.gridX / 2);
        const halfGridY = Math.floor(this.gridY / 2);
        const x = ((i - 1) % this.gridX) - halfGridX + this.xHalf;
        const y = halfGridY + this.yHalf - Math.floor((i - 1) / (this.gridY));
        this.putPiece({ x, y });
      }
    },
    onTouchStart(e) {
      this.$store.commit('setInitPos', e);
      this.$store.commit('pinchStart', e);
    },
    onTouchMove(e) {
      this.$store.commit('gridMove', e);
      this.$store.commit('pinchMove', e);
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
.btns {
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
}
.btn {
  cursor: pointer;
  background: #fff;
  font-size: 150%;
  border: 1px solid #000;
  text-align: center;
  height: 50px;
  width: 50px;
  line-height: 50px;
}
.btn:hover {
  background: #f77;
  color: #fff;
}
.plus {
  margin-left: 10px;
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
  box-shadow: 2px 3px 0px 0px #000;
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

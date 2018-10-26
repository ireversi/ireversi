<template>
  <div class="main"
  >
    <Modal />
    <!-- <div class="board"
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
    </div> -->
    <div class="board"
      @touchstart="onTouchStart"
      @mousedown="setInitPos"
      @touchmove="onTouchMove"
      @mousemove="gridMove"
      @touchend="resetInitPos"
      @touchcancel="resetInitPos"
      @mouseup="resetInitPos"
    >
      <svg viewbox="0 0 100% 100%" width="100%" height="100%">
        <line
          class="border-x"
          v-for="i in Math.ceil($window.height / ($window.width/gridX)) - 1"
          :key="'border-x' + i"
          x1=0
          x2=100%
          :y1="Math.ceil($window.width / gridX) * i"
          :y2="Math.ceil($window.width / gridX) * i"
        />

        <line
          class="border-y"
          v-for="i in gridX - 1"
          :key="'border-y' + i"
          :x1="Math.ceil($window.width / gridX) * i"
          :x2="Math.ceil($window.width / gridX) * i"
          y1=0
          y2=100%
        />

        <circle
          class="piece"
          v-for="i in gridX * Math.ceil($window.height / ($window.width/gridX))"
          v-if="getUserId(i)"
          :key="'piece' + i"
          :r="Math.ceil($window.width / gridX) * 0.3"
          :cx="(i - 1) % gridX * Math.ceil($window.width / gridX)
                + Math.ceil($window.width / gridX) / 2"
          :cy="Math.ceil(i / gridX) * Math.ceil($window.width / gridX)
                - Math.ceil($window.width / gridX) / 2"
          :style="getUserId(i) === currentUser ? 'fill: #444;' : ''"
          filter="url(#dropShadow)"
        />

        <text
          class="user-id"
          v-for="i in gridX * Math.ceil($window.height / ($window.width/gridX))"
          v-if="getUserId(i)"
          :key="'user-id' + i"
          :x="(i - 1) % gridX * Math.ceil($window.width / gridX)
              + Math.ceil($window.width / gridX) / 2"
          :y="Math.ceil(i / gridX) * Math.ceil($window.width / gridX)
              - Math.ceil($window.width / gridX) / 2"
          dy=0.5em
          :style="getUserId(i) === currentUser ? 'stroke: #fff;' : ''"
        >
          {{ getUserId(i) }}
        </text>

        <filter id="dropShadow"
          filterUnits="objectBoundingBox">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
          <feOffset in="SourceGraphic" dx="-1" dy="-1" result="offset"/>
          <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="offset" />
          </feMerge>
        </filter>
      </svg>
    </div>
    <!-- <div class="score">
      <div>Score</div>
      <div>{{ score }}</div>
    </div> -->

    <!-- <Ranking /> -->

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
import Modal from '~/components/Modal.vue';
import Ranking from '~/components/Ranking.vue';
/* デバッグ用 (最終的に削除予定) */
import UserSelector from '~/components/UserSelector.vue';
import ResetButton from '~/components/ResetButton.vue';

/* デバッグ用 */
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    UserSelector,
    ResetButton,
    Modal,
    Ranking,
  },
  async fetch({ store }) {
    await store.dispatch('getBoard');
  },
  mounted() {
    setInterval(async () => {
      this.getBoard();
    }, this.productionCheck ? 300 : 1000);
    window.addEventListener('wheel', this.handleScroll);
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
      'touchTime',
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
        // const gridX = Math.ceil(this.$window.width / 50);
        // const gridY = Math.ceil(this.$window.height / 50);
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
        return this.candidates.find(el => el.x === x && el.y === y);
      };
    },
    touchDistance() {
      return (touches) => {
        const x1 = touches[0].pageX;
        const y1 = touches[0].pageY;
        const x2 = touches[1].pageX;
        const y2 = touches[1].pageY;

        // pinch距離算出
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
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
      // ダブルタップ無効化
      if (new Date().getTime() - this.touchTime < 350) {
        e.preventDefault();
      }

      // drag基準地点
      const position = {
        x: e.pageX || e.changedTouches[0].clientX,
        y: e.pageY || e.changedTouches[0].clientY,
      };

      this.setInitPos(position);

      // pinch基準距離
      const { touches } = e;
      if (touches && touches.length >= 2) {
        const distance = this.touchDistance(touches);

        this.pinchStart(distance);
      }
    },
    onTouchMove(e) {
      e.preventDefault();

      // drag現在地点
      const movePos = {
        x: e.pageX || e.changedTouches[0].clientX,
        y: e.pageY || e.changedTouches[0].clientY,
      };
      this.gridMove(movePos);

      // pinch現在距離
      const { touches } = e;
      if (touches && touches.length >= 2) {
        const distance = this.touchDistance(touches);

        this.pinchMove(distance);
      }
    },
    handleScroll(e) {
      e.preventDefault();
      // ホイール移動量取得
      if (e.deltaY < 0) {
        this.zoomout();
      } else if (e.deltaY > 0) {
        this.zoomin();
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

.border-x, .border-y {
  /* display: inline-block;
  border-top: 1px solid #313;
  border-left: 1px solid #313;
  vertical-align: bottom; */
  stroke: #313;
  stroke-width: 0.5px;
}

/* .cell > div {
  padding-top:100%;
  position: relative;
} */

.piece {
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 50%; */
  /* width: 60%;
  height: 60%; */
  fill: #fff;
  /* display:flex;
  justify-content: center;
  align-items: center; */

  /* font-size:80%; */
}

.user-id {
  text-anchor: middle;
  stroke: #444;
  font-size: 80%;
  font-weight: lighter;
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

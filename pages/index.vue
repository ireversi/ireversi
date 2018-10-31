<template>
  <div class="main">
    <Modal @judgename='judgeUserName'/>

    <div v-if="!token" class="userInputScreen">
      <UserNameInput :nameInput="nameInput"/>
    </div>

    <div class="board"
      v-else
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
          v-for="i in calcGridY() + 2"
          :key="'borderX' + i"
          x1=0
          :x2="$window.width"
          :y1="calcBorderPos(i).y"
          :y2="calcBorderPos(i).y"
        />

        <line
          class="border-y"
          v-for="i in gridX + 2"
          :key="'borderY' + i"
          :x1="calcBorderPos(i).x"
          :x2="calcBorderPos(i).x"
          y1=0
          :y2="$window.height"
        />

        <circle
          class="piece"
          v-for="(piece, i) in pieces"
          :key="'piece' + i"
          :r="calcGridWidth() * 0.3"
          :cx="calcObjPos(piece).x"
          :cy="calcObjPos(piece).y"
          :style="`fill:${piece.userId === userId && flicker ? '' : userPieceColor(piece)};`"
        />

        <circle
          class="candidate"
          v-for="(candidate, i) in candidates"
          :key="'candidate' + i"
          :r="calcGridWidth() * 0.1"
          :cx="calcObjPos(candidate).x"
          :cy="calcObjPos(candidate).y"
        />

        <!-- コマを置くボタンをcandidateの上に重ねて表示 -->
        <circle
          class="put-btn"
          v-for="(candidate, i) in candidates"
          :key="'putBtn' + i"
          :r="calcGridWidth() * 0.5"
          :cx="calcObjPos(candidate).x"
          :cy="calcObjPos(candidate).y"
          @mousedown="setCountTime"
          @touchstart="setCountTime"
          @mouseup="checkElapsedTime(candidate)"
          @touchend="checkElapsedTime(candidate)"
        />

      </svg>
      <Ranking />
      <!-- <LoadingIcon :loading="loading" /> -->
    </div>
  </div>
</template>

<script>
import Modal from '~/components/Modal.vue';
import UserNameInput from '~/components/UserNameInput.vue';
import Ranking from '~/components/Ranking.vue';
import LoadingIcon from '~/components/LoadingIcon.vue';

import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      timer: 0,
      loading: false,
      nameInput: false,
      flicker: false,
    };
  },
  components: {
    Modal,
    Ranking,
    LoadingIcon,
    UserNameInput,
  },
  async fetch({ store }) {
    // await store.dispatch('getAccessToken');
    if (this.token) {
      await store.dispatch('getBoard');
    }
  },
  mounted() {
    const sleep = time => new Promise(resolve => setTimeout(resolve, time));

    (async () => {
      while (true) {
        await sleep(this.productionCheck ? 300 : 1000);
        if (this.token) {
          await this.getBoard();
        }
      }
    })();

    (async () => {
      while (true) {
        await sleep(1400);
        this.flicker = true;
        await sleep(100);
        this.flicker = false;
      }
    })();

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
      'xHalf',
      'yHalf',
      'initX', // mousemove時のxHalf起点情報
      'initY',
      'initLen', // ピンチ操作の基準情報
      'initPosX', // mouseXの起点情報
      'initPosY',
      'dragFlg',
      'touchTime',
      'userId',
      'token',
    ]),
    productionCheck() {
      return process.env.NODE_ENV === 'production';
    },
    calcGridWidth() {
      return () => this.$window.width / this.gridX;
    },
    calcGridY() {
      return () => Math.ceil(this.$window.height / this.calcGridWidth());
    },
    calcCenterPos() {
      return () => ({
        x: this.$window.width / 2,
        y: this.$window.height / 2,
      });
    },
    calcBorderPos() {
      return (i) => {
        const gridWidth = this.calcGridWidth();
        return {
          x: this.calcCenterPos().x // 中心座標
              // Gridの中心が座標となるよう修正
              - gridWidth / 2
              // 画面サイズとグリッド幅から始点計算
              - (Math.ceil((this.$window.width / 2) / gridWidth)) * gridWidth
              // 移動量調整
              - (this.xHalf % gridWidth)
              + (gridWidth * (i - 1)),
          y: this.calcCenterPos().y // 中心座標
              // Gridの中心が座標となるよう修正
              - gridWidth / 2
              // 画面サイズとグリッド幅から始点
              - (Math.ceil((this.$window.height / 2) / gridWidth)) * gridWidth
              // 移動量調整
              + (this.yHalf % gridWidth)
              + (gridWidth * (i - 1)),
        };
      };
    },
    calcObjPos() {
      return (object) => {
        const gridWidth = this.calcGridWidth();
        const centerPos = this.calcCenterPos();
        return {
          x: centerPos.x + (gridWidth * object.x - this.xHalf),
          y: centerPos.y - (gridWidth * object.y - this.yHalf),
        };
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
    userPieceColor() {
      return (p) => {
        if (p.userId !== 1) { // 初期の盤面のuserId === 1の駒があるため
          // [0-9]数字配列
          const numArray = [...Array(10)].map((i, n) => n);
          // アルファベット小文字配列
          const alphabets = [];
          for (let n = 'a'.charCodeAt(0); n <= 'z'.charCodeAt(0); n += 1) {
            alphabets.push(String.fromCodePoint(n));
          }
          // アルファベット大文字配列
          const ALPHABETS = alphabets.map(el => el.toUpperCase());
          // 62通りの文字配列
          const letterArray = [...numArray, ...alphabets, ...ALPHABETS];
          const LETTERARRAY_LENGTH = letterArray.length;
          // アルファベット数字対応表{'a':10, 'b':11, ...}
          const obj = {};
          for (let num = 0; num < LETTERARRAY_LENGTH; num += 1) {
            obj[letterArray[num]] = num;
          }
          const COLOR_RANGE = 360;
          const firstLetterNum = obj[p.userId.split('')[0]];
          const secondLetterNum = obj[p.userId.split('')[1]];
          const hue = COLOR_RANGE / (LETTERARRAY_LENGTH ** 2)
                      * (firstLetterNum * LETTERARRAY_LENGTH + secondLetterNum);
          const color = `hsl(${hue}, 100%, 50% )`;
          return color;
        }
        return '#000'; // ユーザーID = 1の時の場合用
      };
    },
    yourPiece() {
      return (p) => {
        if (p.userId === this.userId) {
          return '#fff';
        }
        return '';
      };
    },
  },
  methods: {
    ...mapMutations(['increment', 'zoomout', 'zoomin', 'changeCurrentUser', 'setHalf', 'setInitPos', 'gridMove', 'resetInitPos', 'pinchStart', 'pinchMove']),
    ...mapActions(['getBoard', 'putPiece']),
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
      if (e.deltaY > 0) {
        this.zoomout();
      } else if (e.deltaY < 0) {
        this.zoomin();
      }
    },
    setCountTime() {
      this.timer = Date.now();
      if (this.score === 0) {
        this.loading = true;
      }
    },
    checkElapsedTime(candidate) {
      const elapsedTime = Date.now() - this.timer;
      if (this.score !== 0) {
        this.putPiece(candidate);
      } else if (this.score === 0 && elapsedTime <= 3000) {
        this.putPiece(candidate);
      }
      this.timer = 0;
      this.loading = false;
    },
    judgeUserName() {
      if (!this.token) this.nameInput = true;
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
.userInputScreen {
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background: center/cover url('../assets/image/board.png');
}
.main {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background: #00552e;
}

.board {
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}

.border-x, .border-y {
  stroke: #121;
  stroke-width: 0.5px;
}

.piece, .candidate {
  fill: #fff;
}

.put-btn {
  fill-opacity: 0;
  cursor: pointer;
}

.userid {
  text-anchor: middle;
  fill: #444;
}

</style>

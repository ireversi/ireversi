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
          :style="`fill:${userPieceColor(piece)};stroke:${yourPiece(piece)}`"
        />

        <!-- デバッグ用(色を設定するまでは本番環境でも表示) -->
        <text
          class="userid"
          v-for="(piece, i) in pieces"
          :key="'userId' + i"
          :font-size="calcGridWidth() * 0.2"
          :x="calcObjPos(piece).x"
          :y="calcObjPos(piece).y + calcGridWidth() * 0.05"
        >
          {{ piece.userId ? piece.userId : 'null' }}
        </text>

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

        <!-- 影設定 -->
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

    <div class="score">
      <div>Score</div>
      <div>{{ score }}</div>
      <!-- 仮 -->
      <div v-if="score === 0">
        {{ '3秒長押しして下さい' }}
      </div>
    </div>

    <Ranking />

    <!-- <UserSelector
      :number="number"
      :current="currentUser"
      @change="changeCurrentUser"
    /> -->

    <div v-if="checkPC" class="btns">
      <div class="minus btn" @click="zoomout"> - </div>
      <div class="plus btn" @click="zoomin"> + </div>
    </div>

    <LoadingIcon :loading="loading" />
  </div>
</template>

<script>
import Modal from '~/components/Modal.vue';
import Ranking from '~/components/Ranking.vue';
import LoadingIcon from '~/components/LoadingIcon.vue';
/* デバッグ用 (最終的に削除予定) */
import UserSelector from '~/components/UserSelector.vue';
import ResetButton from '~/components/ResetButton.vue';

/* デバッグ用 */
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      timer: 0,
      loading: false,
    };
  },
  components: {
    UserSelector,
    ResetButton,
    Modal,
    Ranking,
    LoadingIcon,
  },
  async fetch({ store }) {
    await store.dispatch('getAccessToken');
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
    ]),
    productionCheck() {
      return process.env.NODE_ENV === 'production';
    },
    checkPC() {
      const { userAgent } = navigator;
      if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1
          || userAgent.indexOf('iPod') > -1 || userAgent.indexOf('Android') > -1) {
        return false;
      }
      return true;
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
        if (p.userId !== 1) { // 初期場面のユーザーID = 1の駒対策
          const userIdArry = p.userId.split('');
          const hueArry = [];
          for (let i = 0; i < 2; i += 1) {
            hueArry.push(userIdArry[i].match(/\d|0/) ? +userIdArry[i] : userIdArry[i].charCodeAt());
          }
          const hue = Math.floor((hueArry.reduce((sum, num) => sum + num, 0)) / 2);
          const color = `hsl(${hue}, 80%, 60% )`;
          return color;
        }
        return '#000'; // ユーザーID = 1の時の場合用
      };
    },
    // yourPiece(p) {
    //   console.log(p);
    //   return () => (p.userId === this.userId ? 'purple' : '');
    // },
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
  stroke: #313;
  stroke-width: 0.5px;
}

.piece, .candidate {
  fill: #fff;
}

.piece {
  filter: url(#dropShadow);
}

.put-btn {
  fill-opacity: 0;
  cursor: pointer;
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
  height: 35px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  border-bottom: 1px solid #555;
}

.userid {
  text-anchor: middle;
  fill: #444;
}

</style>

<template>
  <div class="main">
    <div class="board">
      <div>
        <div
          class="cell"
          v-for="i in Math.pow(grid, 2)"
          :key="i"
          :style="`width: ${ 100 / grid }%;
           background-color: ${ showEnable(i) };`"
        >
          <div @click="send(i)">
            <div
              class="piece"
              v-if="getUserId(i)"
              :style="currentUser === getUserId(i) ? 'background-color: #fff' : ''"
            >{{ getUserId(i) }}</div>
          </div>
        </div>
      </div>
    </div>
    <UserSelector
     :currentUser="currentUser"
     :number="number"
     @change="changeCurrentUser"
    />
    <ZoomSelector
     :zoomList="zoomList"
     @zoomer="zoomGrid"
    />
    <!-- <MoveField
     :move="move"
     @selectMove="selectMove"
    /> -->
  </div>
</template>

<script>
import UserSelector from '~/components/kai/UserSelector.vue';
import ZoomSelector from '~/components/kai/ZoomSelector.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    UserSelector,
    ZoomSelector,
  },
  fetch({ store }) {
    return store.dispatch('kai/index/getBoard');
  },
  methods: {
    ...mapMutations('kai/index', ['changeCurrentUser', 'zoomGrid']),
    ...mapActions('kai/index', ['postPiece']),
    async send(i) {
      const half = Math.floor(this.grid / 2);
      const x = ((i - 1) % this.grid) - half;
      const y = half - Math.floor((i - 1) / this.grid);

      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);
      params.append('userId', this.currentUser);

      this.postPiece(params);
    },
    // selectMove(n) {
    //   this.
    // },
  },
  computed: { // computed: データによって一意の値を返すもの
    ...mapState('kai/index', [
      'mypath',
      'board',
      'number',
      'grid',
      'currentUser',
      'zoomList',
    ]),
    getUserId() {
      return (i) => {
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half;
        const y = half - Math.floor((i - 1) / this.grid);
        const put = (this.board.find(n => n.x === x && n.y === y) || {}).userId;
        return put;
      };
    },
    showEnable() {
      return (i) => {
        const dirXY = [
          [0, 1], // 北
          [1, 0], // 東
          [0, -1], // 南
          [-1, 0], // 西
        ];
        const dirAll = [
          ...dirXY,
          [-1, 1], // 北西
          [1, 1], // 北東
          [1, -1], // 南東
          [-1, -1], // 南西
        ];

        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half;
        const y = half - Math.floor((i - 1) / this.grid);
        let dirId = (this.board.find(n => n.x === x && n.y === y) || {}).userId;

        // フィールドに自コマがあるとき、その自コマから８方向に調べに行く
        if (dirId === this.currentUser) {
          console.log('自コマありますよ');

          for (let h = 0; h < dirAll.length; h += 1) {
            const dirX = dirAll[h][0];
            const dirY = dirAll[h][1];
            const aroundX = x + dirX; // 向かいたい方向のxの値
            const aroundY = y + dirY; // 向かいたい方向のyの値

            let n = 1; // 向かう方向の距離
            dirId = (this.board.find(p => p.x === aroundX && p.y === aroundY) || {}).userId;
            console.log('dirId');
            console.log(dirX, dirY, dirId);

            while (dirId !== this.currentUser || dirId !== undefined) {
              console.log(dirId);
              n += 1; // 先に進む
              const nextX = x + dirX * n;
              const nextY = y + dirY * n;
              dirId = (this.board.find(p => p.x === nextX && p.y === nextY) || {}).userid;
              if (dirId === undefined) {
                return '#0ff';
              }
            }
          }
        // フィールドに自コマがないとき、他コマの上下左右にしか置けない処理
        // } else {
        //   for (let k = 0; k < dirXY.length; k += 1) {
        //     const dirX = dirXY[k][0];
        //     const dirY = dirXY[k][1];
        //     const aroundX = x + dirX; // 調べたい方向のxの値
        //     const aroundY = y + dirY; // 調べたい方向のyの値
        //     const dirPiece = this.board.find(p => p.x === aroundX && p.y === aroundY);
        //     // 誰かのコマがあるか
        //     if (dirPiece === undefined) {
        //       return '#0ff';
        //     }
        //   }
        }
        return '#009B3B';
      };
    },
  },
};
</script>

<style scoped>
.test-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  padding: 10px 30px;
}
.main {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  background-color: #009B3B;
}
.board {
  padding-top: 100%;
  position: relative;
}
.board > div {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
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
  background-color: #888;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #444;
  font-size: 120%;
  font-weight: bold;
}
</style>

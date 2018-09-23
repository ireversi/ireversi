<template>
  <div class="main">
    <div class="board">
      <div>
        <div
          class="cell"
          v-for="i in Math.pow(grid, 2)"
          :key="i"
          :style="!getUserId(i) ? // 空白セルの場合、showEnableが発火
           `width: ${ 100 / grid }%;
            background-color: ${ showEnable(i) };`
            : `width: ${ 100 / grid }%;`"
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
        const id = (this.board.find(n => n.x === x && n.y === y) || {}).userId;
        return id;
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

        // iの座標を定義
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half;
        const y = half - Math.floor((i - 1) / this.grid);
        // 自コマがあるかどうか
        const current = this.board.find(p => p.userId === this.currentUser);

        let dirId = (this.board.find(p => p.x === x && p.y === y) || {}).userId;
        // フィールドに自コマがある場合、８方向に向かって検索
        if (current) {
          for (let h = 0; h < dirAll.length; h += 1) {
            const dirX = dirAll[h][0];
            const dirY = dirAll[h][1];
            const aroundX = x + dirX; // 向かいたい方向のxの値
            const aroundY = y + dirY; // 向かいたい方向のyの値

            let n = 1; // 進む距離
            // 進行方向の１つめのコマ
            dirId = (this.board.find(p => p.x === aroundX && p.y === aroundY) || {}).userId;
            // 隣接する１つ目が他コマだったら先に進む
            if (dirId !== this.currentUser && dirId !== undefined) {
              // 他コマがある限り進む
              while (dirId !== undefined || dirId !== this.currentUser) {
                const nextX = aroundX + dirX * n;
                const nextY = aroundY + dirY * n;
                n += 1;
                dirId = (this.board.find(b => b.x === nextX && b.y === nextY) || {}).userId;
                if (dirId === undefined) { // 端にコマがない場合スキップ
                  break;
                }
                if (dirId === this.currentUser) { // 終端が自コマの場合、色変わる
                  return '#0ff';
                }
              }
            }
          }
          // フィールドに自コマが１つもない場合
        } else if (!current) {
          for (let h = 0; h < dirXY.length; h += 1) {
            const dirX = dirAll[h][0];
            const dirY = dirAll[h][1];
            const aroundX = x + dirX; // 向かいたい方向のxの値
            const aroundY = y + dirY; // 向かいたい方向のyの値

            // その方向にコマがあるか
            dirId = (this.board.find(p => p.x === aroundX && p.y === aroundY) || {}).userId;
            if (dirId !== undefined && dirId !== this.currentUser) {
              return '#0ff';
            }
          }
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

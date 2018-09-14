<template>
    <div class="main">
      <div class="board">
        <div>
          <div
            class="cell"
            v-for="i in Math.pow(grid, 2)"
            :key="i"
            :style="`width: ${100/grid}%; background:${putAbleCheck(i)}`"
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
        @change="changeCurrentUser"/>
      <div class="users">
        <div
          v-for="n in number"
          :key="n"
          :style="currentUser === n ? `background: #f77` : ''"
          @click="currentUser = n"
        >{{ n }}</div>
      </div>
    </div>
      <!-- <div>{{ JSON.stringify(board) }}</div> -->
</template>

<script>
import UserSelector from '~/components/fujii/UserSelector.vue';

export default {
  components: {
    UserSelector,
  },
  async asyncData({ app }) {
    const mypath = process.env.FUJII_PATH;
    const board = await app.$axios.$get(`${mypath}/board`);
    return {
      mypath,
      board,
      number: 8,
      currentUser: 2,
    };
  },
  data() {
    const grid = 21;
    return {
      grid,
    };
  },

  mounted() {
    setInterval(async () => {
      this.board = await this.$axios.$get(`${this.mypath}/board`);
    }, 1000);
  },
  computed: {
    getUserId() {
      return (i) => {
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half;
        const y = half - Math.floor((i - 1) / (this.grid));
        return (this.board.find(el => el.x === x && el.y === y) || {}).userId;
      };
    },
    putAbleCheck() {
      return (i) => {
        const adjacentPieces = [
          [0, 1], [1, 0], [0, -1], [-1, 0],
        ];
        const adjacents = [
          ...adjacentPieces, [1, 1], [1, -1], [-1, -1], [-1, 1],
        ];

        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half;
        const y = half - Math.floor((i - 1) / (this.grid));
        const targetUser = this.currentUser;
        const updatePieces = []; // めくるための空の配列

        for (let j = 0; j < adjacents.length; j += 1) {
          const adj = adjacents[j]; // 短い変数へ入れる
          const candidates = []; // めくる可能性のある駒を入れるための空配列
          let target = this.board.find(el => el.x === x + adj[0] && el.y === y + adj[1]);
          let flag = false; // falseで立てておき、同じuserIdが見つかればtrueに切り替えて止める
          let n = 1;

          // 周りが存在する限り
          while (target) {
            if (target.userId === targetUser) {
              flag = true;
              break;
            } else {
              // めくる可能性のある駒をcandidatesに送る
              candidates.push(target);
              // targetの更新(nをかけることで一つ先の方向に進む)
              n += 1;
              /* eslint-disable-next-line no-loop-func */
              target = this.board.find(e => e.x === x + adj[0] * n && e.y === y + adj[1] * n);
            }
          }

          // whileループを回した後に同じidのものが見つかっていれば、
          if (flag) {
            updatePieces.push(...candidates);
          }
        }

        // その場所にあるかどうかの判定
        const exist = this.board.find(e => e.x === x && e.y === y);

        // 自分の駒がない場合の処理
        if (!this.board.find(el => el.userId === targetUser)) {
          let existBy = false;
          // 上下左右を確認
          for (let k = 0; k < 4; k += 1) {
            const adj = adjacentPieces[k];
            // 上下左右に駒があれば
            if (this.board.find(el => el.x === x + adj[0] && el.y === y + adj[1])) {
              existBy = true;
              break;
            }
          }
          if (existBy && !exist) {
            return '#ff0';
          }
        }
        if (updatePieces.length > 0 && !exist) {
          return '#ff0';
        }

        return '';
      };
    },
  },
  methods: {
    async send(i) {
      const half = Math.floor(this.grid / 2);
      const x = ((i - 1) % this.grid) - half;
      const y = half - Math.floor((i - 1) / (this.grid));

      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);
      params.append('userId', this.currentUser);

      this.board = await this.$axios.$post(`${this.mypath}/playing`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
    changeCurrentUser(n) {
      this.currentUser = n;
    },
  },
};
</script>

<style scoped>
.main {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:rgb(27,145,57);
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

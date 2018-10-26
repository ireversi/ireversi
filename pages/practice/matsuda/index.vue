<template>
  <div class="main">
    <div class="board">
      <div>
        <div
          class="cell"
          v-for="i in Math.pow(grid, 2)"
          :key="i"
          :style="`width: ${100 / grid}%`"
        >
          <div
            @click="send(i)"
            :style="`background-color: ${(getUserId(i) ? '' : getCandidate(i)) || ''}`"
          >
            <div
              :class="['piece', getUserId(i) === currentUser ? 'white' : 'black']"
              v-if="getUserId(i)"
            >{{ getUserId(i) }}</div>
          </div>
        </div>
      </div>
    </div>

    <UserSelector
      :number="number"
      :current="currentUser"
      @change="changeCurrentUser"/>
  </div>
</template>

<script>
import UserSelector from '~/components/matsuda/UserSelector.vue';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    UserSelector,
  },
  fetch({ store }) {
    return store.dispatch('practice/matsuda/index/getBoard');
  },
  data() {
    return {
      grid: 29,
      number: 16,
      currentUser: 1,
    };
  },
  mounted() {
    setInterval(async () => {
      // this.board = await this.$axios.$get(`${this.mypath}/board`);
    }, 2000);
  },
  computed: {
    ...mapState('practice/matsuda/index', [
      'mypath',
      'board',
    ]),
    getUserId() {
      return (i) => {
        const half = Math.floor(this.grid / 2);
        const x = ((i - 1) % this.grid) - half;
        const y = half - Math.floor((i - 1) / this.grid);
        return (this.board.find(p => p.x === x && p.y === y) || {}).userid;
      };
    },
    getCandidate() {
      return (idx) => {
        const adjacentVectors = [
          [0, 1], // [x, y]
          [1, 0],
          [0, -1],
          [-1, 0],
        ];

        const vectors = [
          ...adjacentVectors,
          [-1, 1],
          [1, 1],
          [1, -1],
          [-1, -1],
        ];

        const half = Math.floor(this.grid / 2);
        const x = ((idx - 1) % this.grid) - half;
        const y = half - Math.floor((idx - 1) / this.grid);
        const userId = this.currentUser;
        const pieces = this.board;

        const needsUpdatePieces = [];

        for (let i = 0; i < vectors.length; i += 1) {
          const vector = vectors[i];
          const candidates = [];
          let n = 1;
          let target = pieces.find(p => p.x === x + vector[0] && p.y === y + vector[1]);
          let turnable = false;

          while (target) {
            if (target.userid === userId) {
              turnable = true;
              break;
            } else {
              candidates.push(target);
              n += 1;
              // eslint-disable-next-line no-loop-func
              target = pieces.find(p => p.x === x + vector[0] * n && p.y === y + vector[1] * n);
            }
          }

          if (turnable) needsUpdatePieces.push(...candidates);
        }

        if (needsUpdatePieces.length === 0) {
          if (pieces.find(p => p.userid === userId)) {
            return null;
          }

          let isAdjacent = false;
          for (let i = 0; i < adjacentVectors.length; i += 1) {
            const vector = adjacentVectors[i];
            if (pieces.find(
              p => p.x === x + vector[0] && p.y === y + vector[1] && p.userid !== userId,
            )) {
              isAdjacent = true;
              break;
            }
          }

          if (pieces.length > 0 && !isAdjacent) {
            return null;
          }
        }

        return 'rgba(255, 255, 0, 0.7)';
      };
    },
  },
  methods: {
    ...mapActions('practice/matsuda/index', ['putPiece']),
    async send(i) {
      const half = Math.floor(this.grid / 2);
      const x = ((i - 1) % this.grid) - half;
      const y = half - Math.floor((i - 1) / this.grid);

      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);
      params.append('userid', this.currentUser);

      this.putPiece(params);
    },
    changeCurrentUser(n) {
      this.currentUser = n;
    },
  },
};
</script>

<style scoped>
.main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  background: rgb(27, 145, 57);
}

.board {
  padding-top: 100%;
  position: relative;
}

.board > div {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  transform: translate(-50%,-50%);
  border-radius: 50%;
  width: 60%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 120%;
  font-weight: bold;
}

.white {
  background: #fff;
  color: #333;
}

.black {
  background: #333;
  color: #fff;
}
</style>

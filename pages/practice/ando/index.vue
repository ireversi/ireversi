<template>
  <div class="main">
    <div class="board">
      <div>
        <div
          class="cell"
          v-for="i in Math.pow(grid, 2)"
          :key="i"
          :style="`width: ${100 / grid}%;`"
        >
          <div
            @click="changeColor(i); send(i)"
            :style="`background-color:${judgePlaceable(i) ? '#ff0' : ''}`"
          >
            <div
              class="piece"
              v-if="getUserId(i)"
              :style="judgeCurrentUserPiece(i)
                ? `background-color: ${colors[i] || '#fff'}; color: #444`
                : 'background-color: #444; color: #ccc'"
            >
              {{ getUserId(i).userId || getUserId(i).userid || getUserId(i).user_id }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <user-selector
      :number="number"
      :current="currentUser"
      @change="changeCurrentUser"

    />
    <button class="select-btn up-btn" @click="moveUp"> ↑ </button>
    <button class="select-btn right-btn" @click="moveRight"> → </button>
    <button class="select-btn down-btn" @click="moveDown"> ↓ </button>
    <button class="select-btn left-btn" @click="moveLeft"> ← </button>
    <button class="select-btn zoom-out" @click="zoomOut"> - </button>
    <button class="select-btn zoom-in" @click="zoomIn"> + </button>
    <color-palette
      :list="colorList"
      :current="currentColorIndex"
      @select="changeColorIndex"
    />
  </div>
</template>

<script>
import UserSelector from '~/components/ando/UserSelector.vue';
import ColorPalette from '~/components/ando/ColorPalette.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    UserSelector,
    ColorPalette,
  },
  async fetch({ store }) {
    await store.dispatch('practice/ando/index/getBoard');
  },
  mounted() {
    // setInterval(async () => {
    //   this.board = await this.$axios.$get(`${this.mypath}/board`);
    // }, 1000);
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('practice/ando/index', [
      'counter',
      'mypath',
      'board',
      'grid',
      'number',
      'currentUser',
      'colors',
      'colorList',
      'currentColorIndex',
      'centerPosition',
    ]),
    getNavState() {
      return this.$store.state.navState;
    },
    getUserId() {
      return (i) => {
        const result = this.board.find(
          p => p.x === ((i - 1) % this.grid) - Math.floor(this.grid / 2) + this.centerPosition.x
            && p.y === this.grid - 1 - (Math.floor(this.grid / 2)
                        + Math.floor((i - 1) / this.grid)) + this.centerPosition.y,
        );
        return result || false;
      };
    },
    judgeCurrentUserPiece() {
      return i => this.getUserId(i).userId === this.currentUser
                  || this.getUserId(i).userid === this.currentUser
                  || this.getUserId(i).user_id === this.currentUser;
    },
    judgePlaceable() {
      return (i) => {
        if (this.board.length === 0) {
          return true;
        }
        const adjacentPieces = [
          [0, 1], [1, 0], [0, -1], [-1, 0],
        ];
        const adjacents = [
          ...adjacentPieces, [1, 1], [1, -1], [-1, -1], [-1, 1],
        ];

        const x = ((i - 1) % this.grid) - Math.floor(this.grid / 2) + this.centerPosition.x;
        const y = this.grid - 1 - (Math.floor(this.grid / 2) + Math.floor((i - 1) / this.grid))
                  + this.centerPosition.y;
        const updatePieces = [];

        for (let j = 0; j < adjacents.length; j += 1) {
          const adj = adjacents[j];
          const candidates = [];
          let target = this.board.find(p => p.x === x + adj[0] && p.y === y + adj[1]);
          let flag = false;
          let n = 1;

          while (target) {
            if (target.userId === this.currentUser
                || target.userid === this.currentUser
                || target.user_id === this.currentUser) {
              flag = true;
              break;
            } else {
              candidates.push(target);
              n += 1;
              /* eslint-disable-next-line no-loop-func */
              target = this.board.find(e => e.x === x + adj[0] * n && e.y === y + adj[1] * n);
            }
          }
          if (flag) {
            updatePieces.push(...candidates);
          }
        }
        const exist = this.board.find(e => e.x === x && e.y === y);

        if (!this.board.find(p => p.userId === this.currentUser
                                   || p.userid === this.currentUser
                                   || p.user_id === this.currentUser)) {
          let existBy = false;

          for (let k = 0; k < 4; k += 1) {
            const adj = adjacentPieces[k];

            if (this.board.find(el => el.x === x + adj[0] && el.y === y + adj[1])) {
              existBy = true;
              break;
            }
          }
          if (existBy && !exist) {
            return true;
          }
        }
        if (updatePieces.length > 0 && !exist) {
          return true;
        }
        return false;
      };
    },
  },
  methods: {
    ...mapMutations('practice/ando/index', [
      'moveUp',
      'moveRight',
      'moveDown',
      'moveLeft',
      'zoomOut',
      'zoomIn',
      'changeCurrentUser',
      'changeColorIndex',
      'changeColor',
    ]),
    ...mapActions('practice/ando/index', ['putPiece']),
    async send(i) {
      const x = ((i - 1) % this.grid) - Math.floor(this.grid / 2);
      const y = this.grid - 1 - (Math.floor(this.grid / 2) + Math.floor((i - 1) / this.grid));

      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);
      params.append('userId', this.currentUser);
      params.append('userid', this.currentUser);
      params.append('user_id', this.currentUser);

      this.putPiece(params);
    },
  },
};
</script>

<style scoped>
.select-btn {
  position: fixed;
  padding: 10px;
  width: 50px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #ccc;
  border: 2px solid #ccc;
  background-color: #333;
  cursor: pointer;
}
.up-btn {
  top: 20px;
  left: 50%;
}
.right-btn {
  right: 20px;
  top: 50%;
}
.down-btn {
  bottom: 20px;
  left: 50%;
}
.left-btn {
  left: 120px;
  top: 50%;
}
.zoom-out {
  bottom: 20px;
  left: 40%;
}
.zoom-in {
  bottom: 20px;
  left: 60%;
}

.main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: green;
}

.board {
  padding-top:100%;
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
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width: 60%;
  height: 60%;
  /* background-color: #444; */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  font-size: 120%;
  font-weight: bold;
}

</style>

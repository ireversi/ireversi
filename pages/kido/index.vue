
<template>
  <div class='main'>
    <div class='board'>
      <div>
        <div class='cell'
         v-for='i in Math.pow(grid,2)'
        :key='i'
        :style='`width:${100/grid}%`'
        >
        <div @click='send(i)'>
          <div class='piece' v-if='getUserId(i)'>{{ getUserId(i) }}</div>
        </div>
        </div>
      </div>
    </div>
  <UserSelector :number='number' :current='currentUser' @change='changeCurrentUser'/>
  </div>
</template>

<script>
import UserSelector from '~/components/kido/UserSelector.vue';

export default {
  components: {
    UserSelector,
  },
  async asyncData({ app }) {
    const mypath = process.env.KIDO_PATH;
    const board = await app.$axios.$get(`${mypath}/board`);
    // console.log(board);
    return {
      mypath,
      board,
      grid: 19,
      number: 8,
      currentUser: 1,
    };
  },
  // mounted() {
  //   setInterval(async () => {
  //     this.board = await this.$axios.$get(`${this.mypath}/board`);
  //   }, 1000);
  // },
  computed: {
    getUserId() {
      return (i) => {
        const xaxis = ((i - 1) % this.grid) - (Math.ceil(this.grid / 2)) + 1;
        const yaxis = ((Math.ceil(this.grid / 2)) - Math.floor((i - 1) / this.grid) + 1);
        for (let j = 0; j < this.board.length; j += 1) {
          const piece = this.board[j];
          if (piece.x === xaxis && piece.y === yaxis) {
            return piece.userid;
          }
        }
        return false;
      };
    },
  },
  methods: {
    async send(i) {
      const xaxis = ((i - 1) % this.grid) - (Math.ceil(this.grid / 2)) + 1;
      const yaxis = ((Math.ceil(this.grid / 2)) - Math.floor((i - 1) / this.grid) + 1);
      const params = new URLSearchParams();
      params.append('x', xaxis);
      params.append('y', yaxis);
      // params.append('userid', 100);
      params.append('userid', this.currentUser);

      this.board = await this.$axios.$post(`${this.mypath}/piece`, params, {
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
  display:inline-block;
  border:1px solid #333;
  vertical-align: bottom;
}

.cell > div {
  padding-top: 100%;
  position: relative;
}
.piece {
  position:absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width:60%;
  height:60%;
  background: white;
  display: flex;
  justify-content: center;
  align-items:center;
  color: #444;
  font-size:120%;
  font-weight:bold;
}

</style>

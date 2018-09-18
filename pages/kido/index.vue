
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
  <ZoomOut :grid='grid' @zoomOut='zoomOut'/>
  <ZoomIn :grid='grid' @zoomIn='zoomIn'/>
  <UserSelector :number='number' :current='currentUser' @change='changeCurrentUser'/>
  </div>
</template>

<script>
import UserSelector from '~/components/kido/UserSelector.vue';
import ZoomIn from '~/components/kido/ZoomIn.vue';
import ZoomOut from '~/components/kido/ZoomOut.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    UserSelector,
    ZoomIn,
    ZoomOut,
  },
  async fetch({ store }) {
    await store.dispatch('kido/index/getBoard');
  },
  // mounted() {
  //   setInterval(async () => {
  //     this.board = await this.$axios.$get(`${this.mypath}/board`);
  //   }, 1000);
  // },
  computed: {
    ...mapState('kido/index', [
      'mypath',
      'board',
      'grid',
      'number',
      'currentUser',
    ]),
    getUserId() {
      return (i) => {
        const xaxis = ((i - 1) % this.grid) - (Math.ceil(this.grid / 2)) + 1;
        const yaxis = ((Math.ceil(this.grid / 2)) - Math.floor((i - 1) / this.grid) + 1);
        for (let j = 0; j < this.board.length; j += 1) {
          const piece = this.board[j];
          if (piece.x === xaxis && piece.y === yaxis) {
            // return piece.userid; // kido
            return piece.userId; // fujii
          }
        }
        return false;
      };
    },
  },
  methods: {
    ...mapMutations('kido/index', ['changeCurrentUser', 'zoomIn', 'zoomOut']),
    ...mapActions('kido/index', ['putPiece']),
    async send(i) {
      const xaxis = ((i - 1) % this.grid) - (Math.ceil(this.grid / 2)) + 1;
      const yaxis = ((Math.ceil(this.grid / 2)) - Math.floor((i - 1) / this.grid) + 1);
      const params = new URLSearchParams();
      params.append('x', xaxis);
      params.append('y', yaxis);
      params.append('userId', this.currentUser);
      // this.board = await this.$axios.$post(`${this.mypath}/piece`, params, { // kido
      this.putPiece(params); // fujii
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

.white {
  background: white;
  color: #444;
}

.black {
  background: black;
  color: #fff;
}

.test-btn{
  position:fixed;
  bottom:20px;
  left:50%;
  padding:10px 30px;
}

</style>

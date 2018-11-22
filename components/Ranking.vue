<template>
  <div class="ranking">
    <div class="title">
      <div>Players: {{ userCounts }}</div>
    </div>
    <div v-for="(obj, i) in topScores" :key="i">
      <div class="rank">
        <span :style="`background:${rankingColor(i + 1)}`">
          <span class="num">{{ i + 1 }}</span>
        </span>
      </div>
      <div class="userName">{{ obj.userName }}</div>
      <div class="score">{{ obj.score }}</div>
    </div>
    <div class="your-score">
      <div class="rank">-</div>
      <div class="userName">You</div>
      <div class="score">{{ score }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'score',
      'userCounts',
      'topScores',
    ]),
    rankingColor() {
      return (i) => {
        if (i === 1) {
          return '#dab413';
        }
        if (i === 2) {
          return '#6e7b84';
        }
        if (i === 3) {
          return '#a0541a';
        }
        return 'transparent';
      };
    },
  },
};
</script>

<style scoped>
.ranking{
  background: rgba(0, 40, 20, 0.8);
  width: 300px;
  position: fixed;
  top: 0;
  right: 0;
  color: #fff;
}

.ranking > div {
  width: 100%;
  display:flex;
  text-align: center;
  line-height: 40px;
  height: 40px;
  border-bottom: 1px solid #888;
}

.title > div {
  margin: 0 auto;
}

.rank {
  width: 15%;
}

.rank > span {
  width: 18px;
  height: 18px;
  display: inline-block;
  line-height: 18px;
  transform: rotate(45deg);
}

.num {
  display:inline-block;
  transform: rotate(-45deg);
}

.userName {
  width: 60%;
  border-left: 1px solid #555;
}

.score {
  width: 25%;
  border-left: 1px solid #555;
}

.ranking > .your-score {
  border-bottom: none;
  border-top: 1px solid #fff;
}

@media screen and (max-width: 800px){
  .ranking{
    width: 150px;
  }
  .ranking > div {
    line-height: 30px;
    height: 30px;
  }
  .rank > span {
    width: 14px;
    height: 14px;
    display: inline-block;
    line-height: 14px;
    transform: rotate(45deg);
  }
}
</style>

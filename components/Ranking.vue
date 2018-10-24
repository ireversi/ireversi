<template>
  <div class="ranking">
    <div v-for="i in 5" :key="i">
      <div class="rank">
        <span :style="`background:${rankingColor(i)};color:${i <= 3 ? '#fff': ''}`">
          <span class="num">{{ i }}</span>
        </span>
      </div>
      <div class="userName">Name</div>
      <div class="score">10</div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
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
        return '#fff';
      };
    },
  },
};
</script>

<style scoped>
.ranking{
  background: #fff;
  width: 300px;
  height: auto;
  position: fixed;
  top: 0;
  right: 0;
  border-radius: 5px;
  border: 2px solid #555;
}

.ranking > div {
  width: 100%;
  display:flex;
  text-align: center;
  line-height: 40px;
  height: 40px;
  border-bottom: 1px solid #555;
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
</style>

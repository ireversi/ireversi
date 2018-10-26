<template>
  <div class="zoomTab">
    <div
     v-for="n in zoomList"
     :key="n"
     @click="changeGrid(n)"
    >{{ n }}</div>
  </div>
</template>

<script>
export default {
  props: ['zoomList'],
  methods: {
    changeGrid(n) {
      this.$emit('zoomer', n);
    },
  },
};
</script>

<style>
.zoomTab {
  position: fixed;
  bottom: 0;
  right: 0;
  background: #fff;
  width: 100px;
}
.zoomTab > div {
  box-sizing: border-box;
  width: 50%;
  height: 50px;
  border-radius: 5px;
  border: 2px solid #555;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 150%;
  cursor: pointer;
}
.zoomTab > div:hover {
  background: #fff;
}
</style>

<template>
  <div class="palette">
    <div
      v-for="(color, idx) in list"
      :key="color"
      :style="`background-color: ${color};
       border-color: ${ changeBorder(idx, current) };`"
      @click="selectColor(idx)"
    />
  </div>
</template>

<script>
export default {
  // 属性値を決めるのはprops
  props: ['list', 'current'],
  computed: {
    changeBorder() {
      return (idx, current) => (idx === current ? '#0ff' : '');
    },
  },
  methods: {
    selectColor(idx) {
      this.$emit('select', idx);
    },
  },
};
</script>

<style>
.palette {
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: #fff;
  width: 100px;
}
.palette > div {
  box-sizing: border-box;
  width: 50%;
  height: 50px;
  border-radius: 5px;
  border: 3px solid #555;
  display: inline-block;
  cursor: pointer;
}
.palette > div:hover {
  border-color: #ff0;
}
</style>

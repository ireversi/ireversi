<template>
    <div class="pallette">
      <div
        v-for="(color, idx) in list"
        :key="color"
        :style="`background-color: ${color};
          border-color: ${ getBorderColor(idx,current) };`"
        @click="selectColor(idx)"
      >
      </div>
    </div>
</template>

<script>
export default {
  props: ['list', 'current'],
  computed: {
    getBorderColor() {
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
.pallette {
    position:fixed;
    bottom:0;
    right: 0;
    background-color: #fff;
    width:100px;
}

.pallette > div {
    box-sizing: border-box;
    width: 50%;
    height: 50px;
    border-radius: 5px;
    border: 2px solid #555;
    display: inline-block;
    cursor: pointer;
}

.pallette > div:hover {
    border-color: #ff0;
}


</style>

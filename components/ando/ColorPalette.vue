<template>
    <div class="palette">
        <div
            v-for="(color, idx) in list"
            :key="color"
            :style="`
                background-color: ${color};
                border-color: ${setBorderColor(idx, current)}
            `"
            @click="selectColor(idx)"
        />
    </div>
</template>

<script>
export default {
  props: ['list', 'current'],
  computed: {
    setBorderColor() {
      return (idx, current) => ((idx === current) ? '#0ff' : '');
    },
  },
  methods: {
    selectColor(idx) {
      this.$emit('select', idx);
    },
  },
};
</script>

<style scoped>
.palette {
    position: fixed;
    bottom: 0;
    right: 0;
    background: #333;
    width: 100px;
}

.palette > div {
    box-sizing: border-box;
    width: 50%;
    height: 50px;
    border-radius: 5px;
    border: 2px solid #555;
    display: inline-block;
    cursor: pointer;
}

.palette > div:hover {
    border-color: #ff0;
}

</style>

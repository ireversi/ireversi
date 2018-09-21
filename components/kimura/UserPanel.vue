<template>
  <div class="panel">
    <div
      class="panelCell"
      v-for="(user, idx) in list"
      :key="user"
      :style="`bakcground-color: #fff;
        border-color: ${ getBorderColor(idx, current) };`"
      @click="selectUser(idx)"
    >
      <div class="panelCellinner">
        {{ user }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list', 'current'],
  computed: {
    getBorderColor() {
      return (idx, current) => ((idx + 1) === current ? '#0ff' : '');
    },
  },
  methods: {
    selectUser(idx) {
      this.$emit('select', idx + 1);
    },
  },
};
</script>

<style>
.panel{
  position:fixed;
  bottom:0;
  left: 0;
  background-color: #fff;
  width:100px;
}

.panel > div {
    box-sizing: border-box;
    width: 50%;
    height: 50px;
    border-radius: 5px;
    border: 2px solid #555;
    display: inline-block;
    cursor: pointer;
}

.panel > div:hover {
    border-color: #ff0;
}

.panelCellinner{
  border:none;
  text-align: center;
  margin-top:14px;
}

</style>

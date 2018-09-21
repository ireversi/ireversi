
<template>
<div class='zoom'>
    <div class='zoom-out'
    @click="zoomOut(grid)"
    >ー</div>
</div>
</template>

<script>
export default {
  props: ['grid'],
  methods: {
    zoomOut(g) {
      const e = g + 2;
      this.$emit('zoomOut', e);
    },
  },
};
</script>

<style scoped>
 .zoom{
   position: fixed;
   top: 0;
   left: 0;
   background: #fff;
   width:50px;
 }

 .zoom > div{
  box-sizing : border-box;
  width: 100%;
  height:100%;
  border-radius: 5px;
  border: 2px solid #555;
  display:inline-flex;
  justify-content: center;
  align-content: center;
  cursor:pointer;
 }

</style>

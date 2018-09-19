
<template>
<div class='zoom'>
    <div class='zoom-in'
    @click="zoomIn(grid)"
    >＋</div>
</div>
</template>

<script>
export default {
  props: ['grid'],
  methods: {
    zoomIn(g) {
      const p = g - 2;
      this.$emit('zoomIn', p);
    },
  },
};
</script>

<style scoped>
 .zoom{
   position: fixed;
   top: 0;
   left: 50px;
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

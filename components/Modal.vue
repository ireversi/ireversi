<template>
    <transition name="modal">
      <div v-if="overlay" class="modalLayer">
        <div class="initMsg">
          <div class="title">iReversi</div>
          <div class="startBtn" @click="closeOverLayer">Start</div>
        </div>
      </div>
    </transition>
</template>

<script>
export default {
  data() {
    return {
      overlay: true,
    };
  },
  methods: {
    closeOverLayer() {
      this.overlay = false;
    },
  },
};
</script>

<style>
.modalLayer {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.initMsg {
  width: 80%;
  height: 30%;
  /* background: #fff; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.title{
  color: #fff;
  font-size: 80px;
  font-weight: bold;
}

.startBtn {
  margin: 5% auto;
  color: #000;
  background: #fff;
  border: 1px solid #000;
  border-radius: 5%;
  width: 20%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-active {
  transition: opacity 2s;
}

@media screen and (max-width: 800px){
  .startBtn {
    width: 40%;
  }
}
</style>

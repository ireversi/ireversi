<template>
    <transition name="modal">
      <div v-if="nameInput" class="modalLayer">
        <transition name="instruction">
          <div class="initMsg">
            <div class="title">名前を入力してください</div>
            <form class="form" @submit.prevent="sendName">
              <input type="text" class="input">
              <div class="sendBtn" @click="sendName">send</div>
            </form>
          </div>
        </transition>
      </div>
    </transition>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: [
    'nameInput',
  ],
  methods: {
    ...mapActions(['getAccessToken']),
    sendName() {
      this.getAccessToken();
    },
  },
};
</script>

<style scoped>
.modalLayer {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 30, 10, 0.7);
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
  font-size: 40px;
  font-weight: bold;
  font-family: serif;
}

.form {
  margin: 30px auto 0;
  display: flex;
  justify-content: center;
  width: auto;
  text-align: center;
}

.input {
  color: #000;
  border: 3px solid #fff;
  border-radius: 5px;
  font-size: 30px;
  width: 200px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.4s;
}

.sendBtn {
  margin-left: 5px;
  color: #fff;
  border: 3px solid #fff;
  border-radius: 5px;
  font-size: 30px;
  width: 150;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.4s;
  cursor: pointer;
  padding: 0 5px;
}

.sendBtn:hover {
  color: #020;
  background: #fff;
}

/* モーダル部分 */

.modal-enter {
  opacity: 0;
}

.modal-enter-to {
  opacity: 1;
}

.modal-enter-active{
  transition: opacity 2s;
}

/* 案内部分 */


@media screen and (max-width: 800px){
  .startBtn {
    width: 40%;
  }
}
</style>

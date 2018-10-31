<template>
    <transition name="modal">
      <div v-if="nameInput" class="modalLayer">
        <transition name="instruction">
          <div class="initMsg">
            <div class="title">名前を入力してください</div>
            <div class="condition">アルファベット小文字、数字、アンダースコアのみが使えます</div>
            <form class="form" @submit.prevent="sendName">
              <input type="text"
                class="input"
                placeholder="'test'(仮)と入力"
                v-model="name"
                minlength="4"
                maxlength="15"
                required
              >
              <div class="sendBtn" @click="sendName">send</div>
            </form>
            <div v-if="errorMsg1" class="errorMsg">大文字を使わないでください</div>
            <div v-if="errorMsg2" class="errorMsg">特殊記号文字を使わないでください</div>
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
  data() {
    return {
      name: '',
      errorMsg1: false,
      errorMsg2: false,
    };
  },
  methods: {
    ...mapActions(['getAccessToken']),
    sendName() {
      this.errorMsg1 = false;
      this.errorMsg2 = false;
      const reg1 = new RegExp(/[A-Z]/g);
      const reg2 = new RegExp(/['!#$%&()*+,.:;=?"@[\]|^{}-]/g);
      if (this.name.match(reg1)) this.errorMsg1 = true;
      if (this.name.match(reg2)) this.errorMsg2 = true;
      // this.getAccessToken();
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

.condition {
  margin: 30px auto 0;
  font-size: 12px;
  color: white;
}

.form {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: auto;
  text-align: center;
}

.errorMsg{
  font-size: 18px;
  color:red;
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

@media screen and (max-width: 800px){
  .startBtn {
    width: 40%;
  }
}
</style>

<template>
    <transition name="modal">
      <div v-if="nameInput" class="modalLayer">
        <transition name="instruction">
          <div class="initMsg">
            <div class="title">{{ templates[language].t }}</div>
            <div class="condition">{{ templates[language].c }}</div>
            <form class="form" @submit.prevent="sendName">
              <input type="text"
                class="input"
                v-model="name"
                minlength="4"
                maxlength="15"
                pattern="^[a-z0-9]([_a-z0-9]){2,13}[a-z0-9]$"
                required
              >
              <div class="sendBtn" @click="sendName">{{ templates[language].b }}</div>
            </form>
            <nav>
              <ul>
                <li v-for="(i, n) in languages" :key="i.code">
                  <a href="#" @click.prevent="ChangeLanguage(i.code)" class="lang">
                    <!-- 仮で決め打ちしています。 -->
                    <img :src="`${getFlag(n)}`" class="flag"><br>
                    {{ i.language }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </transition>
      </div>
    </transition>
</template>

<script>
import { mapActions } from 'vuex';
import koreaImg from '@/assets/image/han.png';
import japanImg from '@/assets/image/ja.png';
import usImg from '@/assets/image/en.png';
import indonesiaImg from '@/assets/image/in.png';

export default {
  props: [
    'nameInput',
  ],
  data() {
    return {
      name: '',
      language: 'ja', // デフォルト言語
      languages: [
        { language: 'English', code: 'en' },
        { language: '한국어', code: 'han' },
        { language: 'Bahasa', code: 'in' },
        { language: '日本語', code: 'ja' },
      ],
      templates: {
        en: {
          t: 'Enter your name',
          c: 'Only available small letters, numbers and underbar',
          b: 'send',
        },
        han: {
          t: '이름을 입력해주세요',
          c: '알파벳 소문자, 숫자, 그리고 밑줄만 이용 가능합니다',
          b: '전송',
        },
        in: {
          t: 'Masukkan Nama Anda',
          c: 'Hanya tersedia huruf kecil, angka dan underbar',
          b: 'kirim',
        },
        ja: {
          t: '名前を入力してください',
          c: 'アルファベット小文字、数字、アンダースコアのみが使えます',
          b: '送信',
        },
      },
    };
  },
  computed: {
    getFlag() {
      return n => ([usImg, koreaImg, indonesiaImg, japanImg][n]);
    },
  },
  methods: {
    ...mapActions(['getAccessToken']),
    sendName() {
      this.getAccessToken();
    },
    ChangeLanguage(i) {
      this.language = i;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.title{
  color: #fff;
  height: 60px;
  font-size: 40px;
  font-weight: bold;
  font-family: serif;
}

.condition {
  height: 16px;
  margin: 30px auto 0;
  font-size: 12px;
  color: white;
}

.form {
  margin: 10px auto 0;
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
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.4s;
  cursor: pointer;
  padding: 0 5px;
  box-sizing: border-box;
  width: 80px;
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

/* 言語選択 */
nav {
  margin: 20px auto;
  width: 300px;
}
ul {
  list-style: none;
  display: flex;
  justify-content: space-around;
  padding: 0;
}
.lang {
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  width: 50px;
}

.flag {
  border-radius: 5px;
  width: 40px;
}

@media screen and (max-width: 800px){
  .startBtn {
    width: 40%;
  }
  .title {
    font-size: 24px;
  }
  .condition {
    height: 16px;
    margin: 10px auto 0;
    font-size: 10px;
  }
  .input {
    font-size: 20px;
    width: 150px;
    height: 40px;
  }
  .sendBtn {
    margin-left: 5px;
    font-size: 20px;
    width: 70px;
    height: 40px;
    cursor: pointer;
  }
  nav {
    margin: 20px auto;
    width: 250px;
  }
}
</style>

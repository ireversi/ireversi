<template>
  <transition name="modal">
    <div v-if="overlay" class="modalLayer">
      <div class="initMsg">
        <div class="title">{{ showTitle }}</div>
        <div class="contents">
          <div v-for="(n, i) in profiles" :key="i">
            <div class="card" :style="`background: center/cover url(${n.img})`"></div>
            <div class="info">
              <div class="name">{{ n.name }}</div>
              <div class="task">{{ n.task }}</div>
              <div class="twitter">
                <a :href="twitterUrl(n.twitter)" target="_blank">{{ n.twitter }}</a>
              </div>
            </div>
          </div>
        </div>
        <div class="startBtn" @click="closeOverLayer">CLOSE</div>
      </div>
    </div>
  </transition>
</template>

<script>
import AndoImg from '@/assets/image/ando.jpg';
import FujiiImg from '@/assets/image/fujii.jpg';
import ItoImg from '@/assets/image/ito.jpg';
import KaiImg from '@/assets/image/kai.jpg';
import KidoImg from '@/assets/image/kido.jpg';
import KimuraImg from '@/assets/image/kimura.jpg';

export default {
  data() {
    return {
      overlay: true,
      profiles: [
        {
          name: 'Hideto Ando',
          task: 'Front End',
          twitter: '',
          img: AndoImg,
        },
        {
          name: 'Yohei Fujii',
          task: 'Front End',
          twitter: '@yohei_fujii1127',
          img: FujiiImg,
        },
        {
          name: 'Hisanori Ito',
          task: 'Back End',
          twitter: '',
          img: ItoImg,
        },
        {
          name: 'Shohei Kai',
          task: 'Back End',
          twitter: '@show60',
          img: KaiImg,
        },
        {
          name: 'Kotaro Kido',
          task: 'Back End',
          twitter: '',
          img: KidoImg,
        },
        {
          name: 'Kosuke Kimura',
          task: 'Back End',
          twitter: '',
          img: KimuraImg,
        },
      ],
    };
  },
  computed: {
    showTitle() {
      const titleSelection = {
        ja: '開発者について',
        en: 'About Developers',
        han: '개발자에 대해',
        in: 'tentang pengembang',
      };
      const language = localStorage.getItem('iReversi-Language');
      return titleSelection[language];
    },
    twitterUrl() {
      return (id) => {
        const name = id.slice(1);
        return `https://twitter.com/${name}`;
      };
    },
  },
  methods: {
    closeOverLayer() {
      this.overlay = false;
      this.$emit('close');
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
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.title {
  color: #fff;
  font-size: 80px;
  font-weight: bold;
  font-family: serif;
}

/* 開発者エリア */
.contents {
  width: 700px;
  height: 300px;
  border: 3px solid #fff;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.contents > div {
  position: relative;
}

.info {
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 30, 10, 0.7);
  min-height: 100%;
  min-width: 100%;
  color: #fff;
  padding: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  width: 200px;
  height: 120px;
  border: 1px solid #fff;
}

.info:hover {
  opacity: 1;
}

.name,
.task,
.twitter {
  width: 100%;
}

.twitter > a,
.twitter > a:visited {
  cursor: pointer;
  text-decoration: underline;
  display: inline-block;
  color: #fff;
}

.startBtn {
  margin: 30px auto 0;
  color: #fff;
  background: rgba(0, 30, 10, 0.8);
  border: 3px solid #fff;
  border-radius: 5px;
  font-size: 30px;
  width: 200px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.4s;
}

.startBtn:hover {
  color: #020;
  background: #fff;
}

@media screen and (max-width: 800px) {
  .title {
    font-size: 60px;
  }
  .contents {
    width: 500px;
    height: 600px;
    overflow: scroll;
  }

  .contents > div {
    height: 120px;
    width: 200px;
    margin: 30px 0;
  }
}

@media screen and (max-width: 500px) {
  .title {
    font-size: 40px;
  }
  .contents {
    width: 300px;
    height: 400px;
    overflow: scroll;
  }

  .contents > div {
    height: 120px;
    width: 200px;
    margin: 30px 0;
  }
}
</style>

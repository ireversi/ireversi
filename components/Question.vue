<template>
  <div class="container">
    <div @click="changeFlag" class="question">?</div>
    <transition name="menu">
      <div class="menu">
        <!-- <div v-if="flag" class="message"><a>iReversiについて</a></div> -->
        <div v-if="flag" class="message">
          <a href="#" @click.prevent="openDeveloperInfo">{{ showTitle }}</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: false,
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
  },
  methods: {
    changeFlag() {
      if (this.flag) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    },
    openDeveloperInfo() {
      this.$emit('open');
    },
  },
};
</script>

<style scoped>
.container {
  position: absolute;
  bottom: 0;
  right: 0;
  width: auto;
  height: auto;
}
.question {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  background: rgba(0, 40, 20, 0.8);
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  font-size: 30px;
  cursor: pointer;
}

.menu {
  position: absolute;
  bottom: 80px;
  right: 20px;
}

.message {
  width: 150px;
  padding: 5px;
  border-radius: 5px;
  background: rgba(0, 40, 20, 0.8);
  color: #fff;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transform-origin: right center;
  transition: all 0.5s;
}

.message:hover {
  transform: scale(1.2);
}

.message + .message {
  margin-top: 10px;
}

.message > a, .message > a:visited{
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: #fff;
}
.message > a::after {
  position: absolute;
  bottom: -1px;
  left: 0;
  content: '';
  width: 100%;
  height: 2px;
  background: #fff;
  transform: scale(0, 1);
  transform-origin: center top;
  transition: transform .3s;
}
.message > a:hover::after {
  transform: scale(1, 1);
}

/* .menu-leave-to, .menu-enter{
  transform: translate(-50%, -120px);
}

.menu-leave-active, .menu-enter-active {
  transition: all 1s;
} */

</style>

<template>
    <transition name="loading">
      <div v-if="loading" class="loading">
        <div class="circle"><div class="circle-inner">loading</div></div>
      </div>
    </transition>
</template>

<script>
export default {
  props: [
    'loading',
  ],
};
</script>

<style>
.loading {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  text-align: center;
  font-size: 18px;
  line-height: 100px;
}

.loading-leave-to, .loading-enter{
  transform: translate(-50%, -120px);
}

.loading-leave-active, .loading-enter-active {
  transition: all 0.5s;
}

/* Loading Animation */
.circle {
    margin-top: 20px;
    position: relative;
    width: 100px;
    height: 100px;
    background: #333;
    border-radius: 50%;
    text-align: center;
    overflow: hidden;
    z-index: 1;
}

.circle::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: -50px;
    width: 100px;
    height: 100px;
    background: #999;
    transform-origin: right 50px;
    z-index: 2;
    animation: rotate-circle-left 3s linear forwards;
}

.circle::after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 50px;
    width: 100px;
    height: 100px;
    background: #999;
    transform-origin: left 50px;
    z-index: 3;
    animation: rotate-circle-right 3s linear forwards;
}

.circle .circle-inner {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 70px;
    height: 70px;
    background: #fff;
    border-radius: 50%;
    z-index: 4;
    line-height: 70px;
}

@keyframes rotate-circle-right {
    0%   {
        transform: rotate(0deg);
        background: #999;
    }
    50%  {
        transform: rotate(180deg);
        background: #999;
    }
    50.01% {
        transform: rotate(360deg);
        background: #333;
    }
    100% {
        transform: rotate(360deg);
        background: #333;
    }
}

@keyframes rotate-circle-left {
    0%   { transform: rotate(0deg); }
    50%  { transform: rotate(0deg); }
    100% { transform: rotate(180deg); }
}

/* @media screen and (max-width: 800px){
  .loading {
    width: 70px;
    height: 70px;
    font-size: 12px;
  }

  .circle {
    margin-top: 20px;
    position: relative;
    width: 70px;
    height: 70px;
    background: #333;
    border-radius: 50%;
    text-align: center;
    overflow: hidden;
    z-index: 1;
  }
  .circle::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: -35px;
    width: 70px;
    height: 70px;
    background: #999;
    transform-origin: right 35px;
    z-index: 2;
    animation: rotate-circle-left 3s linear forwards;
  }
  .circle::after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 35px;
    width: 70px;
    height: 70px;
    background: #999;
    transform-origin: left 35px;
    z-index: 3;
    animation: rotate-circle-right 3s linear forwards;
  }
  .circle .circle-inner {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    z-index: 4;
    line-height: 50px;
  }
} */
</style>

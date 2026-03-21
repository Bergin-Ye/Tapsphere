<template>
  <button class="metal radial"></button>
</template>

<script setup>
</script>

<style>
/* 去掉 scoped，伪元素 + 复杂渐变必须全局才能正常渲染 */
.metal {
  position: relative;
  outline: none;
  border: none;
  display: block;
  width: 44px;
  /* 原160px → 44px */
  height: 44px;
  /* 原160px → 44px */
  font: bold 1.1em/44px "Helvetica Neue", Arial, sans-serif;
  /* 原4em → 1.1em（4*0.275），行高同步44px */
  text-align: center;
  color: hsla(0, 0%, 20%, 1);
  text-shadow:
    hsla(0, 0%, 40%, .5) 0 -0.275px 0,
    /* 原-1px → -0.275px */
    hsla(0, 0%, 100%, .6) 0 0.55px 0.275px;
  /* 原2px 1px → 0.55px 0.275px */
  background-color: hsl(0, 0%, 90%);
  box-shadow:
    inset hsla(0, 0%, 15%, 1) 0 0px 0px 1.1px,
    /* 原4px → 1.1px（4*0.275） */
    inset hsla(0, 0%, 15%, .8) 0 -0.275px 1.375px 1.1px,
    /* 原-1px 5px 4px → -0.275px 1.375px 1.1px */
    inset hsla(0, 0%, 0%, .25) 0 -0.275px 0px 1.925px,
    /* 原-1px 7px → -0.275px 1.925px */
    inset hsla(0, 0%, 100%, .7) 0 0.55px 0.275px 1.925px,
    /* 原2px 1px 7px → 0.55px 0.275px 1.925px */
    hsla(0, 0%, 0%, .15) 0 -1.375px 1.65px 1.1px,
    /* 原-5px 6px 4px → -1.375px 1.65px 1.1px */
    hsla(0, 0%, 100%, .5) 0 1.375px 1.65px 1.1px;
  /* 原5px 6px 4px → 1.375px 1.65px 1.1px */
  transition: color .2s;
  border-radius: 50%;
  cursor: pointer;
  tabindex: 0;
}

.metal:focus {
  box-shadow: 0 0 0 2px #0071E3 !important;
}

.metal:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease;
}

/* 关键：原版拉丝金属纹理（渐变百分比不变，像素值按比例缩放） */
.metal.radial {
  background-image:
    -webkit-radial-gradient(50% 0%, 8% 50%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),
    -webkit-radial-gradient(50% 100%, 12% 50%, hsla(0, 0%, 100%, .6) 0%, hsla(0, 0%, 100%, 0) 100%),
    -webkit-radial-gradient(0% 50%, 50% 7%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),
    -webkit-radial-gradient(100% 50%, 50% 5%, hsla(0, 0%, 100%, .5) 0%, hsla(0, 0%, 100%, 0) 100%),
    -webkit-repeating-radial-gradient(50% 50%, 100% 100%, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0) 3%, hsla(0, 0%, 0%, .1) 3.5%),
    -webkit-repeating-radial-gradient(50% 50%, 100% 100%, hsla(0, 0%, 100%, 0) 0%, hsla(0, 0%, 100%, 0) 6%, hsla(0, 0%, 100%, .1) 7.5%),
    -webkit-repeating-radial-gradient(50% 50%, 100% 100%, hsla(0, 0%, 100%, 0) 0%, hsla(0, 0%, 100%, 0) 1.2%, hsla(0, 0%, 100%, .2) 2.2%),
    -webkit-radial-gradient(50% 50%, 200% 50%, hsla(0, 0%, 90%, 1) 5%, hsla(0, 0%, 85%, 1) 30%, hsla(0, 0%, 60%, 1) 100%);
}

.metal.radial:before,
.metal.radial:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image:
    -webkit-radial-gradient(50% 0%, 10% 50%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
    -webkit-radial-gradient(50% 100%, 10% 50%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
    -webkit-radial-gradient(0% 50%, 50% 10%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%),
    -webkit-radial-gradient(100% 50%, 50% 6%, hsla(0, 0%, 0%, .1) 0%, hsla(0, 0%, 0%, 0) 100%);
}

.metal.radial:before {
  transform: rotate(65deg);
}

.metal.radial:after {
  transform: rotate(-65deg);
}

.metal:active {
  color: hsl(210, 100%, 40%);
  text-shadow:
    hsla(210, 100%, 20%, .3) 0 -0.275px 0,
    /* 原-1px → -0.275px */
    hsl(210, 100%, 85%) 0 0.55px 0.275px,
    /* 原2px 1px → 0.55px 0.275px */
    hsla(200, 100%, 80%, 1) 0 0 1.375px,
    /* 原5px → 1.375px */
    hsla(210, 100%, 50%, .6) 0 0 5.5px;
  /* 原20px → 5.5px（20*0.275） */
  box-shadow:
    inset hsla(210, 100%, 30%, 1) 0 0px 0px 1.1px,
    /* 原4px → 1.1px */
    inset hsla(210, 100%, 15%, .4) 0 -0.275px 1.375px 1.1px,
    /* 原-1px 5px 4px → -0.275px 1.375px 1.1px */
    inset hsla(210, 100%, 20%, .25) 0 -0.275px 0px 1.925px,
    /* 原-1px 7px → -0.275px 1.925px */
    inset hsla(210, 100%, 100%, .7) 0 0.55px 0.275px 1.925px,
    /* 原2px 1px 7px → 0.55px 0.275px 1.925px */
    hsla(210, 100%, 75%, .8) 0 0px 0.825px 0.55px,
    /* 原3px 2px → 0.825px 0.55px */
    hsla(210, 50%, 40%, .25) 0 -1.375px 1.65px 1.1px,
    /* 原-5px 6px 4px → -1.375px 1.65px 1.1px */
    hsla(210, 80%, 95%, 1) 0 1.375px 1.65px 1.1px;
  /* 原5px 6px 4px → 1.375px 1.65px 1.1px */
}
</style>

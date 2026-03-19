<template>
  <div class="card" ref="cardRef">
    <div class="card-content" ref="contentRef">
      <p class="card-title">TapSphere</p>
      <p class="card-para">
        TapSphereQ@MAIL.COM<br>
        +12 345 678 910 <br>
        New York, NY, USA
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, } from 'vue'

// 暴露卡片和内容的ref，供父组件直接控制
const cardRef = ref(null)
const contentRef = ref(null)

// 提供修改缩放和透明度的方法
const setCardScale = (scale) => {
  if (cardRef.value) {
    cardRef.value.style.transform = `translate(-50%, -50%) scale(${scale})`
  }
}

const setContentOpacity = (opacity) => {
  if (contentRef.value) {
    contentRef.value.style.opacity = opacity
  }
}

// 暴露方法给父组件
defineExpose({
  setCardScale,
  setContentOpacity
})
</script>

<style scoped>
@font-face {
  font-family: 'Inria Serif';
  src: url('@/assets/fonts/InriaSerif-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

.card {
  /* 初始尺寸：248*153 */
  width: 248px;
  height: 153px;
  background-color: #4158D0;
  background-image: linear-gradient(43deg, #91461A 0%, #F7772D 46%, #FFCC70 100%);
  border-radius: 8px;
  color: white;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  perspective: 1000px;
  cursor: pointer;
  border: 1px solid #D4A066;
  transform-origin: center center;
  /* 初始transform：居中+缩放1 */
  transform: translate(-50%, -50%) scale(1);
  z-index: 999;
  transition: transform 0.1s ease-out;
}

.card-content {
  font-family: 'Inria Serif', serif;
  padding: 20px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #dfd5cc;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  /* 初始隐藏 */
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.card-content .card-title {
  font-size: 24px;
  font-weight: 700;
  color: inherit;
  text-transform: uppercase;
  margin: 0;
}

.card-content .card-para {
  color: inherit;
  opacity: 0.8;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* hover效果：基于中心缩放旋转 */
.card:hover {
  transform: translate(-50%, -50%) rotateY(10deg) rotateX(10deg) scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
  z-index: 1;
}

.card:hover:before {
  transform: translateX(-100%);
}

.card:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
  z-index: 1;
}

.card:hover:after {
  transform: translateX(100%);
}
</style>

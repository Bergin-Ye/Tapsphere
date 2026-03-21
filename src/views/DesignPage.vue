<template>
  <div class="design-page">
    <BlackHeader class="header" />
    <div class="leftArea">
      <div class="Renderer"></div>
    </div>
    <div class="rightArea">
      <!-- 颜色选择器 -->
      <div class="colorContainer" v-show="PageNumber === 1">
        <div class="colorTitle">
          Appearance： <p class="p"> Choose the color you like.</p>
        </div>
        <p class="subTitle">Color: XXX</p>
        <div class="colorPicker">
          <el-button class="colorBtn btn1" style="margin-left: 0;"></el-button>
          <el-button class="colorBtn btn2"></el-button>
          <el-button class="colorBtn btn3"></el-button>
          <el-button class="colorBtn btn4"></el-button>
          <el-button class="colorBtn btn5"></el-button>
          <RainbowButton></RainbowButton>
        </div>
      </div>
      <!-- 材质选择器 -->
      <div class="materialContainer" v-show="PageNumber === 2">
        <div class="materialTitle">
          Material：<p class="p"> select the material you like.</p>
        </div>
        <p class="materialSubTitle">Material: XXX</p>
        <div class="materialPicker">
          <!-- （liquid-metal 液态金属） -->
          <smoothButton class="materialBtn"></smoothButton>
          <!-- （switch 渐变磨砂金属） -->
          <matteButton class="materialBtn" style="  margin-left: 30px;"></matteButton>
          <!-- （metal radial 拉丝金属） -->
          <brushedMetal class="materialBtn" style="  margin-left: 30px;"></brushedMetal>
        </div>
      </div>
      <el-button class="nextBtn" @click="handleClick">
        <p>▶</p>Next
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BlackHeader from '@/components/BlackHeader.vue';
import RainbowButton from '@/components/rainbowButton.vue';
import brushedMetal from '@/components/BrushedMetal.vue';
import smoothButton from '@/components/SmoothButton.vue';
import matteButton from '@/components/matteButton.vue';

const PageNumber = ref(1);
const MaxPageNumber = 5;
const isClickDisabled = ref(false);

const handleClick = () => {
  if (isClickDisabled.value) return;
  isClickDisabled.value = true;
  PageNumber.value++;
  console.log(PageNumber.value);
  setTimeout(() => {
    isClickDisabled.value = false;
  }, 500);

}

</script>
<style scoped lang="scss">
.design-page {
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  position: absolute;
}

.header {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: transparent
}

.leftArea {
  width: 50%;
  height: 100%;
  background-color: #ffffff;
  position: relative;
}

.Renderer {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 550px;
  background-color: #F5F5F7;
  border-radius: 30px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
}

.rightArea {
  width: 50%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 80px;
  position: relative;
}

.nextBtn {
  width: 117px;
  height: 54px;
  font-size: 22px;
  position: relative;
  border-radius: 999px;
  left: 80%;
  top: 40%;
  transform: translate(-80%, -40%);
  background-color: #0088FF;
  color: #ffffff;

  .p {
    font-size: 24px;
    margin-right: 8px;
  }
}

.colorContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 290px;
  background-color: #ffffff;
  position: absolute;
}

.colorTitle {
  display: flex;
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  position: relative
}

.p {
  color: #86868B;
}

.subTitle {
  align-items: center;
  justify-content: flex-start;
  font-size: 26px;
  position: relative;
  font-weight: bold;
}

.colorPicker {
  display: flex !important; // 强制横向排列
  align-items: center; // 垂直居中
  flex-wrap: nowrap; // 不换行
}

.colorBtn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  margin-left: 30px;

  &:focus {

    box-shadow: 0 0 0 2px #0071E3 !important;
  }

  &:hover {
    transform: scale(1.08); // 轻微放大
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important; // 阴影加深
  }
}


.btn1 {
  background-color: rgb(42, 41, 42);

}

.btn2 {
  background-color: #fffbf0;
}

.btn3 {
  background-color: #96B0C8;
}

.btn4 {
  background-color: #F8E4C8;
}

.btn5 {
  background-color: #F77E2D;
}

//材质选择器样式
.materialContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 290px;
  background-color: #ffffff;
  position: absolute;
}

.materialTitle {
  display: flex;
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  position: relative
}

.p {
  color: #86868B;
}

.materialSubTitle {
  align-items: center;
  justify-content: flex-start;
  font-size: 26px;
  position: relative;
  font-weight: bold;
}

.materialPicker {
  display: flex !important; // 强制横向排列
  align-items: center; // 垂直居中
  flex-wrap: nowrap; // 不换行
}
</style>

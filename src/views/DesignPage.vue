<template>
  <div class="design-page">
    <BlackHeader class="header" />
    <div class="leftArea">
      <div class="Renderer">
        <div class="card"
          :style="{ background: cardColor, backgroundImage: cardMaterialStyle.backgroundImage, boxShadow: cardMaterialStyle.boxShadow, opacity: cardMaterialStyle.opacity, backgroundBlendMode: cardMaterialStyle.backgroundBlendMode }">
        </div>
      </div>
    </div>
    <div class="rightArea">
      <!-- 颜色选择器 -->
      <div class="colorContainer" v-show="PageNumber === 1">
        <div class="colorTitle">
          Appearance： <p class="p"> Choose the color you like.</p>
        </div>
        <p class="subTitle">Color: {{ colorNow }}</p>
        <div class="colorPicker" @click="colorClick">
          <el-button class="colorBtn btn1" data-color="Matte Black" style="margin-left: 0;"></el-button>
          <el-button class="colorBtn btn2" data-color="Ivory White"></el-button>
          <el-button class="colorBtn btn3" data-color="Sierra Blue"></el-button>
          <el-button class="colorBtn btn4" data-color="Rose Gold"></el-button>
          <el-button class="colorBtn btn5" data-color="Cosmic Orange"></el-button>
          <RainbowButton @panelOpen="() => colorNow = 'Custom Color'" @colorChange="handleCustomColor"></RainbowButton>
        </div>
      </div>
      <!-- 材质选择器 -->
      <div class="materialContainer" v-show="PageNumber === 2">
        <div class="materialTitle">
          Material：<p class="p"> select the material you like.</p>
        </div>
        <p class="materialSubTitle">Material: {{ materialNow }}</p>
        <div class="materialPicker" @click="materialPick">
          <!-- Matte Metal磨砂金属 -->
          <div class="materialBtn" data-material="Matte Metal" style="display: inline-block; cursor: pointer;">
            <smoothButton></smoothButton>
          </div>
          <!-- Satin Metal雾面金属 -->
          <div class="materialBtn" data-material="Satin Metal"
            style="display: inline-block; cursor:pointer ; margin-left: 30px;">
            <matteButton></matteButton>
          </div>
          <!--Brushed Metal 拉丝金属 -->
          <div class="materialBtn" data-material="Brushed Metal"
            style="display: inline-block; cursor: pointer; margin-left: 30px;">
            <brushedMetal></brushedMetal>
          </div>
        </div>
      </div>
      <div class="frontForm" v-show="PageNumber === 3">
        <frontForm></frontForm>
      </div>
      <div class="backForm" v-show="PageNumber === 4">
        <backForm></backForm>
      </div>
      <el-button class="nextBtn" @click="handleClick">
        <p>▶</p>Next
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import BlackHeader from '@/components/BlackHeader.vue';
import RainbowButton from '@/components/rainbowButton.vue';
import brushedMetal from '@/components/BrushedMetal.vue';
import smoothButton from '@/components/SmoothButton.vue';
import matteButton from '@/components/matteButton.vue';
import frontForm from '@/components/frontForm.vue';
import backForm from '@/components/backForm.vue';

const PageNumber = ref(1);
const MaxPageNumber = 5;
const isClickDisabled = ref(false);
const colorNow = ref('');
const materialNow = ref('');
const cardColor = ref('')
const cardMaterialStyle = ref({});

//卡片数据保存
const cardRenderData = ref({
  backgroundColor: '', // 默认颜色（btn1）
  material: '', // 选中的材质名称
  size: { // 卡片尺寸（传给 Three.js 用）
    width: 550,
    height: 347,
    borderRadius: 20,
    ratio: 1.5858
  }
});

//颜色区域
const colorClick = (e) => {
  colorNow.value = e.target.dataset.color;
  const colorBtn = e.target.closest('.colorBtn');
  if (!colorBtn) return;
  const rgbColor = getComputedStyle(colorBtn).backgroundColor;
  const rgbToHex = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g) || [];
    return `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
  };
  const hexColor = rgbToHex(rgbColor);
  cardColor.value = hexColor;
  cardRenderData.value.backgroundColor = hexColor;
  //这里打印的是看当前颜色有没有被保存
  console.log('当前保存的颜色:', cardRenderData.value.backgroundColor);
}

const handleCustomColor = (hexColor) => {
  cardColor.value = hexColor;
  cardRenderData.value.backgroundColor = hexColor;
  console.log('当前保存的颜色:', cardRenderData.value.backgroundColor);
}

//材质区域
const materialStyleLib = {
  'Matte Metal': { // 磨砂金属 - 密集噪点
    backgroundImage: `
      repeating-linear-gradient(0deg,
        transparent 0px,
        rgba(0,0,0,0.015) 1px,
        transparent 2px,
        transparent 3px
      ),
      repeating-linear-gradient(90deg,
        transparent 0px,
        rgba(255,255,255,0.02) 1px,
        transparent 2px,
        transparent 3px
      ),
      repeating-linear-gradient(45deg,
        transparent 0px,
        rgba(0,0,0,0.01) 1px,
        transparent 2px,
        transparent 4px
      ),
      repeating-linear-gradient(-45deg,
        transparent 0px,
        rgba(255,255,255,0.015) 1px,
        transparent 2px,
        transparent 4px
      ),
      linear-gradient(135deg,
        rgba(255,255,255,0.12) 0%,
        transparent 50%,
        rgba(0,0,0,0.08) 100%
      ),
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(0,0,0,0.06) 0%, transparent 40%)
    `,
    boxShadow: `
      inset 0 2px 10px rgba(0,0,0,0.18),
      inset 0 -1px 6px rgba(255,255,255,0.1),
      0 5px 20px rgba(0,0,0,0.25),
      0 2px 10px rgba(0,0,0,0.15)
    `,
    opacity: 0.98,
    backgroundBlendMode: 'multiply'
  },
  'Satin Metal': { // 雾面金属 - 刮花质感
    backgroundImage: `
      repeating-linear-gradient(0deg,
        transparent 0px,
        rgba(0,0,0,0.04) 1px,
        transparent 2px,
        transparent 3px
      ),
      repeating-linear-gradient(90deg,
        transparent 0px,
        rgba(255,255,255,0.03) 1px,
        transparent 2px,
        transparent 3px
      ),
      repeating-linear-gradient(30deg,
        transparent 0px,
        rgba(0,0,0,0.025) 1px,
        transparent 2px,
        transparent 5px
      ),
      linear-gradient(135deg,
        rgba(255,255,255,0.55) 0%,
        rgba(255,255,255,0.35) 20%,
        transparent 50%,
        rgba(0,0,0,0.15) 80%,
        rgba(255,255,255,0.4) 100%
      ),
      linear-gradient(45deg,
        rgba(255,255,255,0.25) 0%,
        transparent 30%,
        rgba(0,0,0,0.1) 50%,
        transparent 70%,
        rgba(255,255,255,0.2) 100%
      ),
      radial-gradient(ellipse at 10% 20%, rgba(255,255,255,0.45) 0%, transparent 55%),
      radial-gradient(ellipse at 90% 80%, rgba(255,255,255,0.35) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)
    `,
    boxShadow: `
      inset 0 3px 12px rgba(255,255,255,0.7),
      inset 0 -2px 8px rgba(0,0,0,0.25),
      0 8px 30px rgba(0,0,0,0.3),
      0 15px 50px rgba(0,0,0,0.2),
      inset 0 0 0 1px rgba(255,255,255,0.25)
    `,
    opacity: 1,
    backgroundBlendMode: 'overlay'
  },
  'Brushed Metal': { // 拉丝铝金属 - 密集横条纹
    backgroundImage: `
      linear-gradient(90deg,
        rgba(255,255,255,0.4) 0%,
        rgba(255,255,255,0.2) 30%,
        transparent 50%,
        rgba(0,0,0,0.12) 70%,
        rgba(255,255,255,0.25) 100%
      ),
      repeating-linear-gradient(0deg,
        rgba(255,255,255,0.15) 0px,
        rgba(255,255,255,0.15) 1px,
        rgba(0,0,0,0.06) 1px,
        rgba(0,0,0,0.06) 2px,
        transparent 2px,
        transparent 3px
      ),
      repeating-linear-gradient(0deg,
        transparent 0px,
        rgba(255,255,255,0.1) 6px,
        transparent 6px,
        transparent 12px
      ),
      repeating-linear-gradient(0deg,
        transparent 0px,
        rgba(0,0,0,0.04) 3px,
        transparent 3px,
        transparent 9px
      ),
      radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.35) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 85%, rgba(0,0,0,0.18) 0%, transparent 55%)
    `,
    boxShadow: `
      inset 0 4px 14px rgba(255,255,255,0.6),
      inset 0 -3px 12px rgba(0,0,0,0.2),
      0 7px 30px rgba(0,0,0,0.38),
      0 4px 16px rgba(0,0,0,0.28),
      inset 0 0 0 1px rgba(255,255,255,0.18)
    `,
    opacity: 1,
    backgroundBlendMode: 'soft-light'
  }
};

const materialPick = (e) => {
  materialNow.value = e.target.closest('[data-material]').dataset.material;
  cardMaterialStyle.value = materialStyleLib[materialNow.value];
  cardRenderData.value.material = materialNow.value;
  console.log(cardRenderData.value.material);

}




//next按钮
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

.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 550px;
  height: 347px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  position: absolute; // 从 relative 改成 absolute，脱离 flex 流
  border-radius: 999px;
  right: 80px; // 固定到右侧 80px
  bottom: 80px; // 固定到底部 80px
  // 删掉 left/top/transform 这三行（之前的定位逻辑）
  // left: 80%;
  // top: 40%;
  // transform: translate(-80%, -40%);
  background-color: #0088FF;
  color: #ffffff;
  z-index: 99; // 确保按钮在最上层，不会被表单遮挡

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

.frontForm {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

<template>
  <div id="liquid-metal" ref="shaderContainer" tabindex="0" @keydown.enter="handleClick" data-material="Matte Metal">
    <div class="inner-circle"></div>
    <div class="outline"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// 降级方案：如果CDN加载失败，显示基础样式
const shaderContainer = ref(null);
let shaderMounted = false;

// 点击事件处理
const handleClick = () => {
  console.log('SmoothButton点击');
};

onMounted(() => {
  // 尝试加载CDN，失败则显示基础样式
  try {
    import("https://esm.sh/@paper-design/shaders").then((module) => {
      const { liquidMetalFragmentShader, ShaderMount } = module;
      if (shaderContainer.value && !shaderMounted) {
        new ShaderMount(
          shaderContainer.value,
          liquidMetalFragmentShader,
          {
            u_repetition: 1.5,
            u_softness: 0.5,
            u_shiftRed: 0.3,
            u_shiftBlue: 0.3,
            u_distortion: 0,
            u_contour: 0,
            u_angle: 100,
            u_scale: 1.5,
            u_shape: 1,
            u_offsetX: 0.1,
            u_offsetY: -0.1
          },
          undefined,
          0.6
        );
        shaderMounted = true;
      }
    });
  } catch (e) {
    console.warn('WebGL shader加载失败，使用基础样式');
  }
});
</script>

<style scoped>
#liquid-metal {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  outline: none;
  /* 加这里！ */
}

#liquid-metal:focus {
  box-shadow: 0 0 0 2px #0071E3 !important;
}

#liquid-metal:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease;
}

.inner-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  background: radial-gradient(circle at 30% 30%, #333, #000);
  border-radius: 50%;
  box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.2);
  z-index: 0;
}

.outline {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 1;
}

.outline::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  border-radius: inherit;
  background: conic-gradient(from 180deg,
      #0000ff,
      #800080,
      #ff0000,
      #800080,
      #0000ff);
  filter: grayscale(1);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: spin 3s linear infinite;
}



@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

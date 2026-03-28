<template>
  <div class="rainbow-button-container">
    <button class="rainbow-btn colorBtn" @click.stop="toggleColorPanel"
      :style="{ backgroundColor: selectedColor }"></button>

    <!-- 苹果风格颜色面板 -->
    <div v-if="showColorPanel" class="apple-color-panel" @click.stop>
      <div class="sv-area" ref="svArea" @mousedown="startSvDrag"
        :style="{ background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` }">
        <div class="sv-cursor" :style="{ left: svPos.x + '%', top: svPos.y + '%' }"></div>
      </div>

      <div class="hue-slider" ref="hueSlider" @mousedown="startHueDrag">
        <div class="hue-cursor" :style="{ left: huePos + '%' }"></div>
      </div>

      <div class="color-info">
        <div class="color-preview" :style="{ backgroundColor: selectedColor }"></div>
        <input class="color-hex" v-model="selectedColor" @input="handleHexInput" placeholder="#000000" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue';

// 定义属性和事件
const props = defineProps({
  modelValue: {
    type: String,
    default: '#FFFFFF'
  }
});

const emit = defineEmits(['update:modelValue', 'colorChange', 'panelOpen']);

// 状态管理
const showColorPanel = ref(false);
const isDragging = ref(false);
const selectedColor = ref(props.modelValue || '#FFFFFF');
const hue = ref(0);
const svPos = reactive({ x: 100, y: 0 });
const huePos = ref(0);
const svArea = ref(null);
const hueSlider = ref(null);

// 切换颜色面板显示
const toggleColorPanel = () => {
  showColorPanel.value = !showColorPanel.value;
  if (showColorPanel.value) {
    // 同步当前颜色到面板并触发 panelOpen 事件
    emit('panelOpen');
    const hex = selectedColor.value;
    const hsl = hexToHsl(hex);
    hue.value = hsl.h;
    huePos.value = (hsl.h / 360) * 100;
    svPos.x = hsl.s;
    svPos.y = 100 - hsl.l * 1.4;
  }
};

// 关闭颜色面板
const closeColorPanel = () => {
  showColorPanel.value = false;
  isDragging.value = false;
};

// 色相拖动
const startHueDrag = (e) => {
  isDragging.value = true;
  const slider = e.currentTarget;
  const rect = slider.getBoundingClientRect();
  const update = (e) => {
    if (!isDragging.value) return;
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    huePos.value = p * 100;
    hue.value = Math.round(p * 360);
    updateColor();
  };
  update(e);
  document.addEventListener('mousemove', update);
  document.addEventListener('mouseup', () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', update);
  });
};

// 饱和度/亮度面板拖动
const startSvDrag = (e) => {
  isDragging.value = true;
  const panel = e.currentTarget;
  const rect = panel.getBoundingClientRect();
  const update = (e) => {
    if (!isDragging.value) return;
    svPos.x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    svPos.y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    updateColor();
  };
  update(e);
  document.addEventListener('mousemove', update);
  document.addEventListener('mouseup', () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', update);
  });
};

// 更新颜色
const updateColor = () => {
  const h = hue.value;
  const s = svPos.x;
  const l = 90 - svPos.y * 0.85;
  const hex = hslToHex(h, s, l);
  selectedColor.value = hex;
  emit('update:modelValue', hex);
  emit('colorChange', hex);
};

// 手动输入色号
const handleHexInput = () => {
  const hex = selectedColor.value;
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    const hsl = hexToHsl(hex);
    hue.value = hsl.h;
    huePos.value = (hsl.h / 360) * 100;
    svPos.x = hsl.s;
    svPos.y = 100 - hsl.l * 1.4;
    emit('update:modelValue', hex);
    emit('colorChange', hex);
  }
};

// HSL → Hex 转换
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Hex → HSL 转换
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }
  return { h: h < 0 ? h + 360 : h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

// 点击外部关闭面板
import { onMounted, onUnmounted } from 'vue';
onMounted(() => {
  document.addEventListener('click', closeColorPanel);
});
onUnmounted(() => {
  document.removeEventListener('click', closeColorPanel);
});
</script>

<style scoped lang="scss">
.rainbow-button-container {
  position: relative;
  display: inline-block;
}

// 继承 colorBtn 核心样式
:deep(.colorBtn) {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  margin-left: 0;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;

  &:focus {
    box-shadow: 0 0 0 2px #0071E3 !important;
    outline: none !important;
  }
}

// 彩虹按钮专属样式
.rainbow-btn {
  --border-radius: 999px;
  --border-width: 4px;
  appearance: none;
  position: relative;
  border: 0 !important;
  background-color: #ffffff;
  z-index: 2;
  padding: 0 !important;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
  }

  &:focus {
    outline: none !important;
  }
}

.rainbow-btn::after {
  --m-i: linear-gradient(#000, #000);
  --m-o: content-box, padding-box;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: var(--border-width);
  border-radius: var(--border-radius);
  background-image: conic-gradient(#488cfb,
      #29dbbc,
      #ddf505,
      #ff9f0e,
      #e440bb,
      #655adc,
      #488cfb);
  -webkit-mask-image: var(--m-i), var(--m-i);
  mask-image: var(--m-i), var(--m-i);
  -webkit-mask-origin: var(--m-o);
  mask-origin: var(--m-o);
  -webkit-mask-clip: var(--m-o);
  mask-composite: exclude;
  -webkit-mask-composite: destination-out;
  filter: hue-rotate(0);
  animation: rotate-hue linear 2s infinite;
  animation-play-state: paused;
  z-index: -1;
}

.rainbow-btn:hover::after {
  animation-play-state: running;
}

@keyframes rotate-hue {
  to {
    filter: hue-rotate(1turn);
  }
}

.rainbow-btn,
.rainbow-btn::after {
  box-sizing: border-box;
}

.rainbow-btn:active {
  --border-width: 5px;
}

// 苹果颜色面板样式
.apple-color-panel {
  position: absolute;
  top: 56px;
  left: 0;
  width: 260px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sv-area {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  cursor: crosshair;
  position: relative;
  overflow: hidden;
}

.sv-cursor {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15);
  transform: translate(-50%, -50%);
}

.hue-slider {
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(to right,
      #ff0000, #ff9900, #ffff00, #00ff00,
      #00ffff, #0099ff, #0000ff, #9900ff,
      #ff00ff, #ff0000);
  cursor: pointer;
  position: relative;
}

.hue-cursor {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #000;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.color-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #d1d1d6;
}

.color-hex {
  flex: 1;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #d1d1d6;
  border-radius: 6px;
  font-size: 14px;
  color: #1d1d1f;
  background: #f2f2f7;

  &:focus {
    outline: none;
    border-color: #007aff;
    background: #e5e5ea;
  }
}
</style>

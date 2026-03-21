<template>
  <button class="rainbow-btn colorBtn"></button>
</template>

<style scoped lang="scss">
// 继承 colorBtn 核心样式，移除focus的蓝色圈
:deep(.colorBtn) {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  margin-left: 30px;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;

  // 核心：清除焦点蓝色圈
  &:focus {
    box-shadow: none !important; // 去掉蓝色光圈
    outline: none !important; // 去掉浏览器默认蓝色外框
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
  font-family: "Roboto", Arial, "Segoe UI", sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  z-index: 2;
  padding: 0 !important;

  // 额外兜底：确保按钮自身focus无蓝色圈
  &:focus {
    outline: none !important;
    box-shadow: none !important;
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
  animation: rotate-hue linear 500ms infinite;
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

// 继承 hover 样式（保留阴影放大效果）
:deep(.colorBtn:hover) {
  transform: scale(1.08);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
}
</style>

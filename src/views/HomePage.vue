<template>
  <div class="front-layout">
    <WhiteHeader class="header" />
    <div class="animation-container">
      <!-- 第一屏：Hero -->
      <div class="heroBgc" ref="heroBgcRef">
        <div class="left-hand" ref="leftHandRef">
          <el-image :src="LeftHand" style="width: 100%; height: 100%;" />
        </div>
        <div class="heroTtitle" ref="heroTitleRef">
          Tap into Connection.
        </div>
        <div class="right-hand" ref="rightHandRef">
          <el-image :src="RightHand" style="width: 100%; height: 100%;" />
        </div>
      </div>

      <!-- 第二屏：Bgc2 -->
      <div class="Bgc2" ref="bgc2Ref">
        <el-image :src="backGroundImages2" class="bgc2-bg-image" />
        <div class="bgc2-content">
          <div class="title2" :style="{ '--mask-width': title2MaskWidth + '%' }">
            {{ titleText }}
          </div>
          <div class="Bcards">
            <Bcards ref="bcardsRef" />
          </div>
          <div class="startButton">
            <startButton />
          </div>
        </div>
      </div>

      <!-- 第三屏：Bgc3 -->
      <div class="bgc3" ref="bgc3Ref">
        <div class="title3" :style="{ '--mask-width': title3MaskWidth + '%' }">
          <p class="line1">{{ title3Line1 }}</p>
          <p class="line1">{{ title3Line2 }}</p>
          <p class="line1">{{ title3Line3 }}</p>
          <p class="line1">{{ title3Line4 }}</p>
        </div>

        <div class="Introduction">
          <el-image class="female" :src="female" fit="cover" />
          <el-image class="male" :src="male" fit="cover" />
          <el-image class="coder" :src="coder" fit="cover" />
        </div>

        <div class="btnContainer">
          <aboutBtn />
          <ContactBtn />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WhiteHeader from '@/components/WhiteHeader.vue'
import Bcards from '@/components/BCards.vue'
import startButton from '@/components/StartButton.vue'
import aboutBtn from '@/components/AboutBtn.vue'
import ContactBtn from '@/components/ContactBtn.vue'

// --- 资源导入 ---
const LeftHand = new URL('@/assets/素材/l1.png', import.meta.url).href
const RightHand = new URL('@/assets/素材/r1.png', import.meta.url).href
const backGroundImages2 = new URL('@/assets/素材/bgc2.png', import.meta.url).href
const female = new URL('@/assets/素材/白女.jpg', import.meta.url).href
const male = new URL('@/assets/素材/白男.jpg', import.meta.url).href
const coder = new URL('@/assets/素材/代码男.jpg', import.meta.url).href

// --- 文本数据 ---
const titleText = ref('Custom NFC Business Cards — Tap to share your identity.')
const title3Line1 = ref('We create fully custom NFC cards')
const title3Line2 = ref('to share your identity and work')
const title3Line3 = ref('with one simple tap')
const title3Line4 = ref('Effortless, fast, modern.')

// --- Refs ---
const bcardsRef = ref(null)
const leftHandRef = ref(null)
const rightHandRef = ref(null)
const heroTitleRef = ref(null)
const bgc2Ref = ref(null)
const heroBgcRef = ref(null)
const bgc3Ref = ref(null)

const title2MaskWidth = ref(0)
const title3MaskWidth = ref(0)

// --- 滚动控制 ---
const scrollDistance = ref(0)
const targetScrollDistance = ref(0)
// 总距离设定：涵盖手 (800) + 顿挫区1 (400) + Bgc2入场 (1500) + 顿挫区2 (400) + Bgc3入场 (1200)
const maxScrollDistance = 4300
// 滚动平滑系数
const scrollSmoothFactor = 0.1

// --- 动画参数 ---
const leftStart = { x: -547, y: 15 }
const leftEnd = { x: -100, y: 140 }
const leftDelta = { x: leftEnd.x - leftStart.x, y: leftEnd.y - leftStart.y }

const rightStart = { x: 1011.06, y: 444.94 }
const rightEnd = { x: 820, y: 400 }
const rightDelta = { x: rightEnd.x - rightStart.x, y: rightEnd.y - rightStart.y }

let animationFrameId = null
let hasTriggeredShake = false

// 状态缓存，避免重复计算
const state = {
  handProgress: -1,
  bgc2RawProgress: -1, // 用于内部逻辑计算
  bgc2TransformProgress: -1, // 用于位移计算
  bgc3Progress: -1,
  cardScale: -1,
  textOpacity: -1
}

// 辅助函数：计算进度 (0 ~ 1)
const getProgress = (start, end) => {
  if (scrollDistance.value <= start) return 0
  if (scrollDistance.value >= end) return 1
  return (scrollDistance.value - start) / (end - start)
}

const updateAnimation = () => {
  // 平滑滚动处理
  const scrollDiff = targetScrollDistance.value - scrollDistance.value
  if (Math.abs(scrollDiff) > 0.1) {
    scrollDistance.value += scrollDiff * scrollSmoothFactor
  } else {
    scrollDistance.value = targetScrollDistance.value
  }

  const currentScroll = scrollDistance.value

  // 1. 手部动画区间: 0 -> 800
  const handProgress = getProgress(0, 800)

  // 2. 第二屏逻辑 (关键修改)
  // 入场区间: 1200 -> 2700 (快速升起)
  // 顿挫区间1: 800 -> 1200 (第一屏完全显示后保持静止)
  // 顿挫区间2: 2700 -> 3100 (第二屏完全显示后保持静止)
  // 计算原始进度用于内部元素动画 (卡片放大等)
  let bgc2RawProgress = getProgress(1200, 2700)

  // 计算实际位移进度 (用于 translateY)
  // 如果超过 2700，位移进度强制为 1 (即完全显示，不再移动)
  const bgc2TransformProgress = bgc2RawProgress >= 1 ? 1 : bgc2RawProgress

  // 3. 第三屏逻辑 (关键修改)
  // 开始区间: 3100 -> 4300 (突破顿挫区后开始升起)
  const bgc3Progress = getProgress(3100, 4300)

  // --- 执行 DOM 更新 ---

  // 持续动画直到目标值
  if (Math.abs(targetScrollDistance.value - scrollDistance.value) > 0.1) {
    animationFrameId = requestAnimationFrame(updateAnimation)
  } else {
    animationFrameId = null
  }

  // A. 手部与 Hero 标题
  if (handProgress !== state.handProgress) {
    state.handProgress = handProgress

    if (leftHandRef.value) {
      leftHandRef.value.style.transform = `translate(${leftStart.x + leftDelta.x * handProgress}px, ${leftStart.y + leftDelta.y * handProgress}px) rotate(10deg)`
    }
    if (rightHandRef.value) {
      rightHandRef.value.style.transform = `translate(${rightStart.x + rightDelta.x * handProgress}px, ${rightStart.y + rightDelta.y * handProgress}px) rotate(20deg)`
    }
    if (heroTitleRef.value) {
      heroTitleRef.value.style.opacity = 1 - handProgress
      heroTitleRef.value.style.transform = `translate(-50%, -50%) scale(${1 - handProgress * 0.07})`
    }

    // 震动效果
    if (handProgress >= 1 && !hasTriggeredShake) {
      hasTriggeredShake = true
      document.body.classList.add('shake-animation')
      setTimeout(() => document.body.classList.remove('shake-animation'), 250)
    }
  }

  // B. 第二屏 (Bgc2)
  // 只要进度有变化 (包括在顿挫区 rawProgress 不变但我们需要确保持续渲染状态)
  if (bgc2RawProgress !== state.bgc2RawProgress || bgc2TransformProgress !== state.bgc2TransformProgress) {
    state.bgc2RawProgress = bgc2RawProgress
    state.bgc2TransformProgress = bgc2TransformProgress

    if (bgc2Ref.value) {
      // 从 100% (底部) 移动到 0% (正常位置)
      bgc2Ref.value.style.transform = `translateY(${(1 - bgc2TransformProgress) * 100}%)`
    }

    if (heroBgcRef.value) {
      // 背景随第二屏入场逐渐淡出
      heroBgcRef.value.style.opacity = 1 - (bgc2RawProgress * 0.3)
    }

    // 卡片放大逻辑 (仅在入场阶段 1000-2500 有效)
    let newCardScale = 1
    if (bgc2RawProgress >= 0.5 && bgc2RawProgress <= 0.8) {
      newCardScale = 1 + 0.786 * ((bgc2RawProgress - 0.5) / 0.3)
    } else if (bgc2RawProgress > 0.8) {
      newCardScale = 1.786
    }

    if (newCardScale !== state.cardScale) {
      state.cardScale = newCardScale
      if (bcardsRef.value && typeof bcardsRef.value.setCardScale === 'function') {
        bcardsRef.value.setCardScale(newCardScale)
      }
    }

    // 内容透明度逻辑
    let newTextOpacity = bgc2RawProgress >= 0.8 ? Math.min(1, (bgc2RawProgress - 0.8) / 0.2) : 0
    if (newTextOpacity !== state.textOpacity) {
      state.textOpacity = newTextOpacity
      if (bcardsRef.value && typeof bcardsRef.value.setContentOpacity === 'function') {
        bcardsRef.value.setContentOpacity(newTextOpacity)
      }
    }

    // Title2 遮罩宽度 (随入场进度变化)
    title2MaskWidth.value = bgc2RawProgress >= 0.5 ? Math.min(100, ((bgc2RawProgress - 0.5) / 0.5) * 100) : 0
  }

  // C. 第三屏 (Bgc3)
  if (bgc3Progress !== state.bgc3Progress) {
    state.bgc3Progress = bgc3Progress

    if (bgc3Ref.value) {
      bgc3Ref.value.style.transform = `translateY(${(1 - bgc3Progress) * 100}%)`
    }

    title3MaskWidth.value = Math.min(100, bgc3Progress * 100)
  }

}

const handleWheel = (e) => {
  e.preventDefault()

  // 更新目标滚动距离
  targetScrollDistance.value += e.deltaY

  // 限制范围
  targetScrollDistance.value = Math.max(0, Math.min(targetScrollDistance.value, maxScrollDistance))

  // 请求动画帧
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(updateAnimation)
  }
}

onMounted(() => {
  // 初始化运行一次，确保状态正确
  updateAnimation()

  // 绑定滚动事件
  window.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'Inknut Antiqua';
  src: url('@/assets/fonts/InknutAntiqua-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Inria Serif';
  src: url('@/assets/fonts/InriaSerif-Regular.ttf') format('truetype');
}

.front-layout {
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.animation-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.header {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: transparent;
}

/* --- Hero Section --- */
.heroBgc {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background: linear-gradient(180deg, #2A0E0E 30%, #9F2B2B 100%);
}

.left-hand,
.right-hand {
  position: absolute;
  z-index: 100;
  opacity: 0.8;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  /* 移除固定宽高，由 JS 或内部 img 控制，防止变形 */
}

.left-hand {
  width: 1133px;
  height: 382px;
  /* 初始位置由 JS 覆盖，这里做保底 */
  transform: translate(-547px, 15px) rotate(10deg) translateZ(0);
}

.right-hand {
  width: 748.43px;
  height: 330.86px;
  transform: translate(1011.06px, 444.94px) rotate(20deg) translateZ(0);
}

.heroTtitle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(1) translateZ(0);
  width: 420px;
  text-align: center;
  font-size: 36px;
  color: #F0C36F;
  line-height: 1.2;
  z-index: 1;
  font-family: 'Inknut Antiqua', serif;
  opacity: 1;
  will-change: opacity, transform;
  backface-visibility: hidden;
}

/* --- Section 2 --- */
.Bgc2 {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  /* 初始在屏幕下方 100% */
  transform: translateY(100%) translateZ(0);
  will-change: transform;
  z-index: 2;
  backface-visibility: hidden;
}

.bgc2-bg-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  object-fit: cover;
}

.bgc2-content {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
  /* 让点击穿透到按钮 */
}

/* 【修复】Title2 渐变色逻辑 */
.title2 {
  position: absolute;
  top: 142px;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  font-size: 24px;
  display: flex;
  gap: 2px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: auto;
  font-family: 'Inria Serif', serif;

  /* 核心修复：渐变从白色过渡到灰色 */
  background: linear-gradient(to right, #ffffff var(--mask-width), #373636 var(--mask-width));

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* 必须透明以显示背景 */

  backface-visibility: hidden;
}

.Bcards {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 10;
  pointer-events: auto;
  width: 0;
  height: 0;
  transform: translateZ(0);
}

.startButton {
  position: absolute;
  bottom: 83px;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  z-index: 10;
  pointer-events: auto;
}

/* --- Shake Animation --- */
:global(.shake-animation) {
  animation: shake 0.5s ease-in-out;
  transform: translateZ(0);
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0) translateZ(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px) translateZ(0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px) translateZ(0);
  }
}

/* --- Section 3 --- */
.bgc3 {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  /* 初始在屏幕下方 100% */
  transform: translateY(100%) translateZ(0);
  will-change: transform;
  z-index: 3;
  background-color: #0A0908;
  backface-visibility: hidden;
  opacity: 1;
  visibility: visible;
  /* 强制GPU加速 */
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* 【修复】Title3 渐变色逻辑 */
.title3 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  top: 80px;
  width: 944px;
  max-width: 100%;
  height: 320px;
  text-align: center;
  font-size: 36px;
  font-weight: normal;
  font-family: 'Inria Serif', serif;
  z-index: 20;
  pointer-events: auto;
  opacity: 1;
  visibility: visible;

  /* 核心修复：渐变从白色过渡到灰色 */
  background: linear-gradient(to right, #ffffff var(--mask-width), #373636 var(--mask-width));

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  backface-visibility: hidden;
  will-change: background-position;
  transform-style: preserve-3d;
  perspective: 1000px;

  .line1 {
    margin: 0 0 20px 0;
    line-height: 1.2;
    white-space: nowrap;
  }
}

.Introduction {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: auto;
  transform: translateZ(0);

  .female,
  .male,
  .coder {
    position: absolute;
    width: 200px;
    height: 250px;
    border-radius: 8px;
    overflow: hidden;
    object-fit: cover !important;
    object-position: center center !important;
    transform: translateZ(0);
    backface-visibility: hidden;

    :deep(img) {
      object-fit: cover !important;
      object-position: center center !important;
      width: 100%;
      height: 100%;
      transform: translateZ(0);
    }
  }

  .female {
    left: 50%;
    top: 400px;
    transform: translateX(-50%) translateX(-280px) rotate(-15deg) translateZ(0);
  }

  .male {
    left: 50%;
    top: 350px;
    transform: translateX(-50%) rotate(0deg) translateZ(0);
  }

  .coder {
    left: 50%;
    top: 400px;
    transform: translateX(-50%) translateX(280px) rotate(15deg) translateZ(0);
  }
}

.btnContainer {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  display: flex;
  gap: 30px;
  z-index: 20;
  pointer-events: auto;
}
</style>

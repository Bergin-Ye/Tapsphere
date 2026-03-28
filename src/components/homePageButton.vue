<template>
  <button @click="handleHome">
    Home Page
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleHome = () => {
  router.push('/home')
}
</script>

<style scoped>
button {
  /* 【关键修改 1】移除固定宽高，让按钮由内容决定大小，防止溢出 */
  width: auto;
  height: auto;

  /* 保持最小尺寸，防止按钮太扁 */
  width: 117px;
  height: 54px;

  border: none;
  display: flex;
  /* 保持内边距，但如果在极小屏幕下仍担心溢出，可改用相对单位如 padding: 0.75rem 1rem; */
  padding: 0.75rem 1.5rem;

  background-color: #488aec;
  color: #ffffff;
  font-size: 14px;
  line-height: 14px;
  font-weight: normal;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  /* 确保内容居中 */
  border-radius: 999px;
  user-select: none;
  gap: 0.75rem;
  box-shadow:
    0 4px 6px -1px #488aec31,
    0 2px 4px -1px #488aec17;
  transition: all 0.6s ease;

  /* 【关键修改 2】强制文字在一行，禁止换行 */
  white-space: nowrap;

  /* 【关键修改 3】如果内容真的太长，隐藏超出部分（通常配合 text-overflow 使用，但这里主要靠 auto 宽度解决） */
  overflow: hidden;
}

/* 确保按钮内的文字元素也遵守不换行规则 */
button span {
  white-space: nowrap;
  text-overflow: ellipsis;
  /* 如果必须固定宽度且文字过长，显示省略号 */
  overflow: hidden;
  max-width: 100%;
}

button:hover {
  box-shadow:
    0 10px 15px -3px #488aec4f,
    0 4px 6px -2px #488aec17;
  /* 悬停时不要改变尺寸，防止抖动 */
  transform: translateY(-1px);
  /* 可选：增加一点悬浮感 */
}

button:focus,
button:active {
  opacity: 0.85;
  box-shadow: none;
  transform: translateY(0);
}
</style>

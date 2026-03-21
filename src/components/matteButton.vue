<template>
  <label class="switch" tabindex="0" @keydown.enter="handleClick">
    <input type="checkbox" @change="handleClick">
    <div class="button">
      <span class="icon">
      </span>
    </div>
  </label>
</template>

<script setup>
const handleClick = () => {
  console.log('按钮点击');
};
</script>

<style>
.switch {
  display: inline-block;
  cursor: pointer;
  outline: none;
  border-radius: 50%;
  transition: all 0.3s ease;
  width: 44px;
  height: 44px;
}

.switch:focus {
  box-shadow: 0 0 0 2px #0071E3 !important;
  border-radius: 50%;
}

.switch:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.switch input {
  display: none;
}

.button {
  position: relative;
  background-image: linear-gradient(#ffffff 33%, #414751 58%, #837b52, #c5baa1, #c3adaa);
  border-radius: 50px;
  padding: 6px;
  border: none;
  outline: none;
  /* 核心：保留默认阴影（移除选中时才清除的逻辑） */
  box-shadow: 0.1em 0 0 #2726267f inset, -0.1em 0 0 #27262600 inset, 0 0.1em 0 #afa490 inset, 0 -0.1em 0 #ffffff3f, 0 0.2em 0.5em #0000007f, 0 -0.1em 0 #151616 inset, -0.1em -0.2em 0 #ffffff7f inset;
  cursor: pointer;
  width: 44px;
  height: 44px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .3s ease-in-out;
}

.button::before {
  position: absolute;
  content: "";
  width: 44px;
  height: 44px;
  border-radius: inherit;
  /* 默认背景 + 选中时的渐变动画 */
  background-color: #606060;
  background-image: linear-gradient(to right, #606060, #4d7cff);
  animation: anime1 .3s linear alternate-reverse infinite;
  z-index: -1;
  transition: background-image .3s ease-in-out;
}

.button .icon {
  /* 修正尺寸：原4rem过大，适配44px按钮 */
  width: 24px;
  height: 24px;
  display: inline-block;
}

.button .icon svg {
  height: 100%;
  width: 100%;
  /* 默认填充色 + 选中时的动画 */
  fill: #000000;
  fill: rgba(77, 124, 255, 0.642);
  animation: anime2 .3s linear alternate-reverse infinite;
  transition: fill .3s ease;
}

/* 移除：选中时清除阴影的逻辑（这是你要删掉的无阴影状态） */
/* .switch input:checked+.button {
  box-shadow: none;
} */

/* 可选：选中时增强效果（保留动画，不清除阴影） */
.switch input:checked+.button::before {
  background-image: linear-gradient(to right, #4d7cff, #7ba0ff);
}

.switch input:checked+.button .icon svg {
  fill: #4d7cff;
}

@keyframes anime1 {
  to {
    background-color: rgb(77, 124, 255);
  }
}

@keyframes anime2 {
  to {
    fill: rgba(77, 124, 255, 0.8);
  }
}
</style>

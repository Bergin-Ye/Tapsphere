<template>

  <router-view></router-view>

</template>

<script setup></script>

<style>
/* 全局重置样式 */
* {
  /* 关键：让 padding 和 border 不包含在 width/height 内，防止布局撑破 */
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  /* 去除浏览器默认的字体大小，方便后续用 rem 布局（可选） */
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #fff;

  /* 防止出现横向滚动条 */
  overflow-x: hidden;
  /* 确保高度占满 */
  min-height: 100vh;
}

/* 去除列表默认样式 (li 的点) */
ul,
ol,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 去除 a 标签下划线和默认颜色 */
a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

/* 去除图片默认的下边距 */
img {
  display: block;
  max-width: 100%;
  height: auto;
  border: 0;
}

/* 去除按钮默认样式 */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

/* 去除输入框默认轮廓 */
input,
textarea,
select {
  outline: none;
  font-family: inherit;
}

/* 清除浮动（以防万一用到浮动布局） */
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  /* 强制清除 margin，!important 防止被其他样式覆盖 */
  padding: 0 !important;
  /* 强制清除 padding */

  /* 确保它是一个块级容器且占满空间 */
  display: block;
}

/* =========================================
   3. 其他全局重置 (列表、图片等)
   ========================================= */
ul,
ol,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
  border: 0;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input,
textarea,
select {
  outline: none;
  font-family: inherit;
}

.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
</style>

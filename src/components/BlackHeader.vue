<template>
  <div class="white-header">
    <div class="left">
      <el-image alt="logo" :src="logo1" style="width: 140px; height: 82px;" @click="handleHome"></el-image>
    </div>
    <div class="right">
      <el-button class="logIn" @click="handleLogIn">Log in</el-button>
      <el-button class="startFree" @click="handleStartFree">Start Free</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logo1 = new URL('@/assets/素材/logo/logo2.png', import.meta.url).href

const handleHome = () => {
  router.push('/home')
}

const handleLogIn = () => {
  router.push('/login')
}

const handleStartFree = () => {
  router.push('/design')
}
</script>

<style scoped lang="scss">
// 引入字体Inria Serif
@font-face {
  font-family: 'Inria Serif';
  src: url('@/assets/fonts/InriaSerif-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

.white-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 82px;
  width: 100%;
}

.left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.right {
  .el-button {
    font-family: 'Inria Serif', serif;
    font-weight: normal;
  }

  .logIn {
    color: #000000;
    background-color: transparent;
    border-color: transparent;
    border-radius: 999px;

    &:hover {
      transform: scale(1.1);
      transition: transform 0.2s;
    }
  }

  .startFree {
    background-color: #F77E2D;
    border-color: #F77E2D;
    border-radius: 999px;
    color: #000000;
    margin-right: 50px;
  }
}
</style>

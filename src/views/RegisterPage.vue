<template>
  <div class="loginPage">
    <WhiteHeader class="header" />
    <div class="ball1"></div>
    <div class="ball2"></div>
    <div class="title">
      <p class="company">TapSphere</p>
      <P class="slogan">Tap into Connection.</P>
    </div>
    <div class="back">
      <p class="backText">Welcome back.!</p>
      <p class="line">---------------------------------</p>
    </div>
    <registerForm class="registerForm" />
  </div>
</template>

<script setup>
import WhiteHeader from '@/components/WhiteHeader.vue';
import registerForm from '@/components/registerForm.vue';

</script>

<style scoped lang="scss">
@font-face {
  font-family: 'NotoSans-Regular';
  src: url('@/assets/fonts/NotoSans-Regular.ttf') format('truetype');
}

.loginPage {
  height: 100vh;
  width: 100vw;
  background-color: #000000;
  display: flex;
  position: relative;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.title {
  position: absolute;
  top: 25%;
  left: 10%;
  font-size: 54px;
  color: #fff;
  display: flex;
  text-align: left;
  flex-direction: column;
  font-family: 'NotoSans-Regular';
}

.back {
  position: absolute;
  top: 50%;
  left: 10%;
  display: flex;

  .backText {
    font-size: 40px;
    color: #fff;
    border: 4px solid #fff;
    font-family: 'NotoSans-Regular';
    font-style: italic;
    padding: 5px 15px;
  }

  .line {
    font-size: 40px;
    color: #F77E2D;
    padding: 5px 0px;
  }
}

.ball1 {
  position: absolute;
  top: 5%;
  left: 60%;
  width: 210px;
  height: 210px;
  background-color: #F77E2D;
  border-radius: 999px;
}

.ball2 {
  position: absolute;
  top: 80%;
  left: 84%;
  width: 150px;
  height: 150px;
  background-color: #F77E2D;
  border-radius: 999px;
}

.registerForm {
  position: absolute;
  top: 10%;
  left: 65%;

}
</style>

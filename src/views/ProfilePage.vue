<template>
  <div class="profile">
    <WhiteHeader class="header" />
    <div class="content">
      <div class="profile-content">
        <div class="profile-picture">
          <img :src="profilePicture" alt="profile picture" />
        </div>
        <div class="profile-info">
          <p class="title">Your name</p>
          <p class="subtitle">yourname@gmail.com</p>
        </div>
      </div>
      <button class="name">
        <p class="lname">Name</p>
        <p class="rname">xxx</p>
      </button>

      <button class="card">
        <p class="lcard">My Cards</p>
        <p class="rcard">View my designs</p>
      </button>

      <button class="order">
        <p class="lorder">Orders</p>
        <p class="rorder">view Order</p>
      </button>

      <button class="save">Save Change</button>
    </div>
  </div>
</template>

<script setup>
import WhiteHeader from '@/components/WhiteHeader.vue';
import profilePicture from '@/assets/素材/profile.jpg';
</script>



<style scoped lang="scss">
.profile {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(#000 35%, #EF6A2C 100%);
  position: relative;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 551px;
  height: 516px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden; // 防止内容溢出圆角
}

.profile-content {
  padding: 40px 0 20px 0; // 去掉左右padding
  width: calc(100% - 80px); // 总宽度-80px（左右各40px）
  margin: 0 40px; // 左右margin让border缩进
  display: flex;
  justify-content: left;
  align-items: center;
  border-bottom: 1px solid #a2a1a1;
  box-sizing: border-box;
}

.profile-picture {
  width: 60px;
  height: 60px;
  background-color: #a2a1a1;
  border-radius: 999px;
  display: flex;
  margin-right: 25px;
  overflow: hidden;
}

.name,
.card,
.order {
  width: calc(100% - 80px);
  height: 80px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #a2a1a1;
  margin: 0 40px;
  box-sizing: border-box;
}

.lname,
.lcard,
.lorder {
  font-size: 22px;
  color: #000000;
}

.rname,
.rcard,
.rorder {
  font-size: 20px;
  color: #4B5563;
}

.save {
  width: 140px;
  height: 40px;
  background-color: #2489FF;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
  margin-left: 40px;
  color: #fff;
  font-weight: bold;
}
</style>

<template>
  <div class="profile">
    <WhiteHeader class="header" />
    <div class="content" v-show="$route.path === '/profile'">
      <div class="profile-content">
        <div class="profile-picture">
          <el-upload :show-file-list="false" :before-upload="beforeAvatarUpload" @change="handleAvatarChange">
            <!-- 有头像 → 显示头像 -->
            <img v-if="userInfo?.avatar" :src="userInfo.avatar" class="avatar-img" />

            <!-- 没头像 → 显示可点击的灰色圆形 -->
            <div v-else class="default-avatar">
              <!-- 加个加号提示可点击 -->
              <span class="plus">+</span>
            </div>

          </el-upload>
        </div>
        <div class="profile-info">
          <p class="title">{{ userInfo?.username }}</p>
          <p class="subtitle">{{ userInfo?.email }}</p>
        </div>
      </div>
      <button class="name">
        <p class="lname">Name</p>
        <p class="rname">{{ userInfo?.username }}</p>
      </button>

      <button class="card">
        <p class="lcard">My Cards</p>
        <p class="rcard" @click="viewMyCards">View my designs</p>
      </button>

      <button class="order">
        <p class="lorder">Orders</p>
        <p class="rorder">view Order</p>
      </button>

      <button class="save">Save Change</button>
    </div>
    <router-view style="position: fixed;inset:0;" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WhiteHeader from '@/components/WhiteHeader.vue';

const router = useRouter()
const userInfo = ref(null)

// 页面加载 → 读取用户（包含头像）
onMounted(() => {
  const user = localStorage.getItem('currentUser')
  if (user) {
    userInfo.value = JSON.parse(user)
  }
})

// 选择图片后触发
function handleAvatarChange(file) {
  // 把图片转成 base64（能存在本地）
  const reader = new FileReader()
  reader.onload = (e) => {
    // 1. 更新页面头像
    userInfo.value.avatar = e.target.result
    // 2. 保存到 localStorage（覆盖！）
    localStorage.setItem('currentUser', JSON.stringify(userInfo.value))
  }
  reader.readAsDataURL(file.raw)
}

// 限制图片大小
function beforeAvatarUpload(file) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    alert('请上传图片！')
    return false
  }
  return true
}

// 查看我的卡片
function viewMyCards() {
  router.push('/cards')
}



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
  border-radius: 999px;
  overflow: hidden;
  margin-right: 25px;
  cursor: pointer;
}

/* 强制让上传区域填满整个圆形 */
:deep(.el-upload) {
  display: block;
  width: 60px;
  height: 60px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background-color: #a2a1a1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
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

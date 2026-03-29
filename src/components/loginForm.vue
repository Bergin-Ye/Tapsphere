<template>
  <div class="login-card">
    <h1 class="login-title">Login</h1>
    <p class="login-subtitle">Glad you're back.!</p>

    <div class="input-group">
      <input type="text" placeholder="Username" class="login-input" v-model="username" />
    </div>

    <div class="input-group">
      <input type="password" placeholder="Password" class="login-input" v-model="password" />
    </div>

    <div class="remember-me">
      <input type="checkbox" id="remember" checked />
      <label for="remember">Remember me</label>
    </div>

    <button class="login-btn" @click="handleLogin">Login</button>

    <!-- 忘记密码 -->
    <p class="forgot-password">Forgot password ?</p>

    <!-- 分隔线 -->
    <div class="divider">
      <span class="divider-line"></span>
      <span class="divider-text">Or</span>
      <span class="divider-line"></span>
    </div>

    <!-- 第三方登录 -->
    <div class="social-login">
      <span class="social-icon" style="font-size: 24px;"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          width="100" height="100" viewBox="0 0 48 48">
          <path fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
          </path>
          <path fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
          </path>
          <path fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
          </path>
          <path fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
          </path>
        </svg></span>
      <span class="social-icon"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
          viewBox="0 0 48 48">
          <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
          <path fill="#fff"
            d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z">
          </path>
        </svg></span>
      <span class="social-icon"><svg t="1774602567179" class="icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="8698" width="200" height="200">
          <path
            d="M512 0c-282.76736 0-512 229.23264-512 512s229.23264 512 512 512 512-229.23264 512-512-229.23264-512-512-512zM816.04608 816.04608c-39.5264 39.50592-85.504 70.53312-136.704 92.18048-13.0048 5.50912-26.2144 10.32192-39.60832 14.49984l0-76.73856c0-40.32512-13.824-70.00064-41.49248-89.00608 17.32608-1.65888 33.25952-3.9936 47.75936-7.00416s29.83936-7.33184 45.99808-13.0048 30.65856-12.41088 43.49952-20.25472 25.16992-18.00192 37.00736-30.49472 21.74976-26.66496 29.75744-42.496 14.336-34.83648 19.00544-56.99584 7.00416-46.592 7.00416-73.25696c0-51.67104-16.83456-95.66208-50.50368-131.9936 15.33952-39.99744 13.66016-83.49696-4.99712-130.49856l-12.4928-1.49504c-8.66304-1.00352-24.24832 2.6624-46.75584 10.99776s-47.75936 21.99552-75.75552 41.00096c-39.66976-10.99776-80.83456-16.50688-123.4944-16.50688-43.008 0-84.00896 5.50912-123.00288 16.50688-17.67424-12.00128-34.4064-21.9136-50.25792-29.75744s-28.50816-13.16864-37.9904-15.99488-18.3296-4.58752-26.50112-5.24288-13.4144-0.83968-15.74912-0.49152-3.9936 0.67584-4.99712 1.00352c-18.65728 47.32928-20.33664 90.8288-4.99712 130.49856-33.66912 36.33152-50.50368 80.34304-50.50368 131.9936 0 26.66496 2.33472 51.07712 7.00416 73.25696s10.99776 41.1648 19.00544 56.99584 17.92 30.0032 29.75744 42.496 24.1664 22.67136 37.00736 30.49472 27.3408 14.58176 43.49952 20.25472 31.49824 9.99424 45.99808 13.0048 30.4128 5.3248 47.75936 7.00416c-27.3408 18.65728-41.00096 48.3328-41.00096 89.00608l0 78.2336c-15.09376-4.48512-29.98272-9.80992-44.60544-15.99488-51.2-21.64736-97.19808-52.67456-136.704-92.18048s-70.53312-85.504-92.18048-136.704c-22.40512-52.96128-33.75104-109.2608-33.75104-167.34208s11.3664-114.3808 33.75104-167.34208c21.64736-51.2 52.67456-97.19808 92.18048-136.704s85.504-70.53312 136.704-92.18048c52.96128-22.40512 109.2608-33.75104 167.34208-33.75104s114.3808 11.3664 167.34208 33.75104c51.2 21.64736 97.19808 52.67456 136.704 92.18048s70.53312 85.504 92.18048 136.704c22.40512 52.96128 33.75104 109.2608 33.75104 167.34208s-11.3664 114.3808-33.75104 167.34208c-21.64736 51.2-52.67456 97.19808-92.18048 136.704z"
            fill="#2c2c2c" p-id="8699"></path>
        </svg></span>
    </div>

    <!-- 注册链接 -->
    <p class="signup-text">
      Don't have an account ? <span class="signup-link" @click="handleRegister">Signup</span>
    </p>

    <!-- 底部链接 -->
    <div class="footer-links">
      <span>Terms & Conditions</span>
      <span>Support</span>
      <span>Customer Care</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleRegister = () => {
  router.push('/register')
}

const handleLogin = () => {
  //获取已经存储的用户列表
  const userList = JSON.parse(localStorage.getItem('userList')) || []
  //查找匹配的用户
  const finduser = userList.find(u => {
    return u.username === username.value && u.password === password.value
  })
  if (!finduser) {
    alert('Username or password is incorrect')
    return
  }
  //登录成功
  //将用户信息存储到本地存储
  localStorage.setItem('currentUser', JSON.stringify(finduser))
  //跳转到首页
  router.push('/home')
}


</script>

<style scoped>
/* 登录卡片：透明毛玻璃效果 */
.login-card {
  width: 380px;
  height: 630px;
  padding: 40px 30px;
  background: rgba(100, 100, 100, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #fff;
  font-family: 'Noto Sans', sans-serif;
}

/* 标题样式 */
.login-title {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.login-subtitle {
  font-size: 16px;
  margin: 0 0 24px 0;
  opacity: 0.9;
}

/* 输入框组 */
.input-group {
  position: relative;
  margin-bottom: 20px;
}

.login-input {
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  color: #fff;
  font-size: 18px;
  box-sizing: border-box;
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.login-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.9);
}

/* 记住我选项 */
.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

.remember-me input {
  accent-color: #6366f1;
}

/* 登录按钮：渐变背景 */
.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #3b82f6, #7e22ce);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.login-btn:hover {
  opacity: 0.9;
}

/* 忘记密码 */
.forgot-password {
  text-align: center;
  font-size: 14px;
  margin: 16px 0 24px 0;
  opacity: 0.8;
  cursor: pointer;
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.divider-text {
  font-size: 14px;
  opacity: 0.8;
}

/* 第三方登录 —— 已修复 ✅ */
.social-login {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-bottom: 30px;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.social-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.social-icon:hover {
  transform: scale(1.1);
}

/* 注册文本 */
.signup-text {
  text-align: center;
  font-size: 14px;
  margin-bottom: 20px;
}

.signup-link {
  color: #a78bfa;
  cursor: pointer;
  font-weight: 500;
}

/* 底部链接 */
.footer-links {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.7;
}
</style>

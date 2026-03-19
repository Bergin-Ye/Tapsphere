<template>
  <button>
    Start Now</button>
</template>

<style scoped>
button {
  width: 204px;
  height: 79px;
  cursor: pointer;
  color: #fff;
  font-size: 17px;
  border-radius: 999px;
  border: none;
  position: relative;
  background: #100720;
  transition: 0.1s;
  border: 1px solid #d4500d;
}

button::after {
  content: '';
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle farthest-corner at 10% 20%, rgba(255, 94, 247, 1) 17.8%, rgba(2, 245, 255, 1) 100.2%);
  filter: blur(15px);
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 999px;
}

button:active {
  transform: scale(0.9) rotate(3deg);
  background: radial-gradient(circle farthest-corner at 10% 20%, rgba(255, 94, 247, 1) 17.8%, rgba(2, 245, 255, 1) 100.2%);
  transition: 0.5s;
  border-radius: 999px;
}
</style>

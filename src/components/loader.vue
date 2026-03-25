<template>
  <div class="loading-overlay">
    <div class="loader">
      <span></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.loader {
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 50%;
  box-shadow: -3px -3px 6px rgba(255, 255, 255, 0.45), 3px 3px 6px rgba(94, 104, 121, 0.137);
}

.loader:before {
  height: 1.8rem;
  width: 1.8rem;
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background: #ececec;
  border-radius: 50%;
  border: 2px solid #e2e1e1;
  box-shadow: inset -3px -3px 6px rgba(255, 255, 255, 0.45), 3px 3px 6px rgba(94, 104, 121, 0.3);
}

.loader span {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: linear-gradient(to bottom, rgb(218, 249, 62), rgb(247, 126, 45));
  animation: rotate 1s infinite linear;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>

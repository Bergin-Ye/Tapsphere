<template>
  <button class="c-button c-button--gooey"> About Us
    <div class="c-button__blobs">
    </div>
  </button>

</template>

<style scoped>
.c-button {
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  padding: 0.9em 1.6em;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  z-index: 1;
  width: 137px;
  height: 64px;
}

.c-button--gooey {
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 4px solid #F77E2D;
  border-radius: 999px;
  position: relative;
  transition: all 700ms ease;
  background-color: #F77E2D;
}

.c-button--gooey .c-button__blobs {
  height: 100%;
  filter: url(#goo);
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: -3px;
  right: -1px;
  z-index: -1;
  border-radius: 999px;
}

.c-button--gooey .c-button__blobs div {
  background-color: #F77E2D;
  width: 34%;
  height: 100%;
  border-radius: 100%;
  position: absolute;
  transform: scale(1.4) translateY(125%) translateZ(0);
  transition: all 700ms ease;
}

.c-button--gooey .c-button__blobs div:nth-child(1) {
  left: -5%;
}

.c-button--gooey .c-button__blobs div:nth-child(2) {
  left: 30%;
  transition-delay: 60ms;
}

.c-button--gooey .c-button__blobs div:nth-child(3) {
  left: 66%;
  transition-delay: 25ms;
}

.c-button--gooey:hover {
  color: #fff;
}

.c-button--gooey:hover .c-button__blobs div {
  transform: scale(1.4) translateY(0) translateZ(0);
}
</style>
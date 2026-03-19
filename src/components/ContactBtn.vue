<template>
  <button>Contact Us</button>
</template>

<style scoped>
button {
  width: 147px;
  height: 64px;
  font-size: 14px;
  --hover-shadows: 16px 16px 33px #121212, -16px -16px 33px #303030;
  --accent: fuchsia;
  font-weight: bold;
  letter-spacing: 0.1em;
  border: none;
  border-radius: 999px;
  background-color: #212121;
  cursor: pointer;
  color: white;
  padding: 1em 2em;
  transition: box-shadow ease-in-out 0.3s, background-color ease-in-out 0.1s,
    letter-spacing ease-in-out 0.1s, transform ease-in-out 0.1s;
  box-shadow: 8px 8px 4px #1c1c1c, -5px -5px 5px #262626;
}

button:hover {
  box-shadow: var(--hover-shadows);
}

button:active {
  box-shadow: var(--hover-shadows), var(--accent) 0px 0px 1px 1px;
  background-color: var(--accent);
  transform: scale(0.95);
}
</style>
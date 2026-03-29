<template>
  <div class="my-cards-page">

    <div v-if="isLoading" class="loadingContainer">
      <loader />
    </div>

    <div ref="threeContainer" class="threeContainer" v-show="!isLoading && hasCard">
    </div>

    <div class="buttonGroup" v-show="!isLoading && hasCard">
      <button class="back-profile-btn" @click="goBack">
        ← Back
      </button>
    </div>

    <div class="senceChange" v-show="!isLoading && hasCard">
      <change-sence @switch-hdr="switchHDR" />
    </div>

    <div v-if="!isLoading && !hasCard" class="empty-state">
      <p>No cards yet. Go design one!</p>
      <button class="design-btn" @click="goToDesign">Design Now</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BlackHeader from '@/components/BlackHeader.vue';
import loader from '@/components/loader.vue';
import changeSence from '@/components/changeSence.vue';
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import html2canvas from 'html2canvas';

const router = useRouter();
const isLoading = ref(true);
const hasCard = ref(false);
const cardData = ref(null);
const threeContainer = ref(null);
let scene, camera, renderer, animateId;
let targetRotationY = 0, targetRotationX = 0;
let frontOverlay, backOverlay;
let cardMesh = null;

const hdrTextures = ref({
  loaded: false,
  textures: {
    environment: null,
    environment2: null,
    environment3: null
  },
  currentHDR: 'environment'
});

const MATERIAL_MAP = {
  "Matte Metal": "/src/assets/素材/材质/磨砂.jpg",
  "Satin Metal": "/src/assets/素材/材质/光滑.jpg",
  "Brushed Metal": "/src/assets/素材/材质/拉丝.jpg"
};

const MATERIAL_PHYSICS = {
  "Matte Metal": { metalness: 0.95, roughness: 0.6 },
  "Satin Metal": { metalness: 1.0, roughness: 0.2 },
  "Brushed Metal": { metalness: 0.95, roughness: 0.45 }
};

const CARD_CONFIG = {
  width: 5.5,
  height: 3.47,
  thickness: 0.18,
  radius: 0.2,
  metalness: 0.75,
  roughness: 0.3,
};

const frontTextList = computed(() => {
  if (!cardData.value) return [];
  return [
    { id: 'FullName' }, { id: 'Position' }, { id: 'Company' },
    { id: 'Telephone' }, { id: 'Email' }
  ].map(item => {
    const text = cardData.value.frontData.texts[item.id] || '';
    const color = cardData.value.frontData.colors[item.id] || '#fff';
    const size = cardData.value.frontData.sizes.find(s => s.id === item.id)?.fontSize || 20;
    const pos = cardData.value.frontTextPositions[item.id];
    return {
      type: 'text',
      id: item.id,
      text,
      color,
      fontSize: size,
      x: pos.x,
      y: pos.y
    };
  });
});

const backTextList = computed(() => {
  if (!cardData.value) return [];
  return [
    { id: 'Company' }, { id: 'Address' }, { id: 'SocialMedia' },
    { id: 'Slogan' }, { id: 'Customtext' }
  ].map(item => {
    const text = cardData.value.backData.texts[item.id] || '';
    const color = cardData.value.backData.colors[item.id] || '#fff';
    const size = cardData.value.backData.sizes.find(s => s.id === item.id)?.fontSize || 20;
    const pos = cardData.value.backTextPositions[item.id];
    return {
      type: 'text',
      id: item.id,
      text,
      color,
      fontSize: size,
      x: pos.x,
      y: pos.y
    };
  });
});

const frontImageList = computed(() => {
  if (!cardData.value || !cardData.value.frontData.images) return [];
  return cardData.value.frontData.images.map((url, idx) => {
    const p = cardData.value.frontImagePositions[idx] || { x: 40, y: 20, scale: 30 };
    return {
      type: 'image',
      uid: 'img_' + idx,
      url,
      x: p.x,
      y: p.y,
      scale: p.scale
    };
  });
});

const backImageList = computed(() => {
  if (!cardData.value || !cardData.value.backData.images) return [];
  return cardData.value.backData.images.map((url, idx) => {
    const p = cardData.value.backImagePositions[idx] || { x: 40, y: 20, scale: 30 };
    return {
      type: 'image',
      uid: 'img_' + idx,
      url,
      x: p.x,
      y: p.y,
      scale: p.scale
    };
  });
});

onMounted(() => {
  loadCardFromStorage();
});

onUnmounted(() => {
  cleanupThree();
});

function loadCardFromStorage() {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.orders && user.orders.length > 0) {
      cardData.value = user.orders[user.orders.length - 1];
      hasCard.value = true;
      setTimeout(() => initThree(), 100);
    } else {
      hasCard.value = false;
      isLoading.value = false;
    }
  } else {
    hasCard.value = false;
    isLoading.value = false;
  }
}

function goBack() {
  router.push('/profile');
}

function goToDesign() {
  router.push('/design');
}

const switchHDR = (hdrName) => {
  if (hdrTextures.value.loaded && hdrTextures.value.textures[hdrName]) {
    const texture = hdrTextures.value.textures[hdrName];
    scene.environment = texture;
    scene.background = texture;
    hdrTextures.value.currentHDR = hdrName;
  }
};

function domToTexture(side) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '550px';
  container.style.height = '347px';
  container.style.backgroundColor = 'transparent';
  container.style.zIndex = '-9999';

  const textList = side === 'front' ? frontTextList.value : backTextList.value;
  const imageList = side === 'front' ? frontImageList.value : backImageList.value;

  textList.forEach(item => {
    const textEl = document.createElement('div');
    textEl.textContent = item.text;
    textEl.style.position = 'absolute';
    textEl.style.left = item.x + '%';
    textEl.style.top = (item.y + -4) + '%';
    textEl.style.color = item.color;
    textEl.style.fontSize = item.fontSize + 'px';
    textEl.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    textEl.style.whiteSpace = 'nowrap';
    textEl.style.userSelect = 'none';
    container.appendChild(textEl);
  });

  imageList.forEach(img => {
    // 检查图片 URL 是否是 blob URL，如果是就跳过（避免加载失败）
    if (img.url && img.url.startsWith('blob:')) {
      console.log('跳过失效的 blob URL:', img.url);
      return;
    }

    const imgEl = document.createElement('div');
    imgEl.style.position = 'absolute';
    imgEl.style.left = (img.x - 1.5) + '%';
    imgEl.style.top = (img.y - 3) + '%';
    imgEl.style.width = img.scale + '%';
    imgEl.style.height = 'auto';
    imgEl.style.overflow = 'visible';
    imgEl.style.padding = '0';
    imgEl.style.margin = '0';
    imgEl.style.lineHeight = '0';

    const imgTag = document.createElement('img');
    // 添加加载失败处理
    imgTag.onerror = () => {
      console.log('图片加载失败，跳过:', img.url);
    };
    imgTag.src = img.url;
    imgTag.style.width = '100%';
    imgTag.style.height = 'auto';
    imgTag.style.objectFit = 'contain';
    imgTag.style.display = 'block';
    imgTag.style.verticalAlign = 'top';
    imgEl.appendChild(imgTag);

    container.appendChild(imgEl);
  });

  document.body.appendChild(container);

  return new Promise((resolve) => {
    html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      allowTaint: true,
      width: 550,
      height: 347,
      onclone: (clonedDoc) => {
        // 在克隆的文档中，把所有图片替换为空，避免加载错误
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          if (img.src && img.src.startsWith('blob:')) {
            img.style.display = 'none';
          }
        });
      }
    }).then(canvas => {
      document.body.removeChild(container);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.flipY = true;
      resolve(texture);
    }).catch(error => {
      console.error('html2canvas 出错:', error);
      document.body.removeChild(container);
      // 创建一个空的 canvas 作为 fallback
      const emptyCanvas = document.createElement('canvas');
      emptyCanvas.width = 550;
      emptyCanvas.height = 347;
      const texture = new THREE.CanvasTexture(emptyCanvas);
      texture.needsUpdate = true;
      texture.flipY = true;
      resolve(texture);
    });
  });
}

async function initThree() {
  const container = threeContainer.value;
  if (!container) return;
  container.innerHTML = '';

  scene = new THREE.Scene();

  const hdrLoader = new RGBELoader();
  const hdrFiles = [
    { name: 'environment', path: '/src/assets/素材/材质/environment.hdr' },
    { name: 'environment2', path: '/src/assets/素材/材质/environment2.hdr' },
    { name: 'environment3', path: '/src/assets/素材/材质/environment3.hdr' }
  ];

  let loadedCount = 0;
  hdrFiles.forEach((hdrFile) => {
    hdrLoader.load(hdrFile.path, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      hdrTextures.value.textures[hdrFile.name] = texture;
      loadedCount++;

      if (loadedCount === hdrFiles.length) {
        hdrTextures.value.loaded = true;
        scene.environment = hdrTextures.value.textures.environment;
        scene.background = hdrTextures.value.textures.environment;
      }
    });
  });

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  window.addEventListener('wheel', handleWheel, { passive: false });

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const textureLoader = new THREE.TextureLoader();
  const selectedColor = cardData.value.color;
  const selectMaterialImg = MATERIAL_MAP[cardData.value.material];
  const baseTexture = textureLoader.load(selectMaterialImg);
  baseTexture.colorSpace = THREE.SRGBColorSpace;

  let frontTexture, backTexture;
  await Promise.all([
    domToTexture('front').then(t => frontTexture = t),
    domToTexture('back').then(t => backTexture = t)
  ]);

  const geometry = new RoundedBoxGeometry(
    CARD_CONFIG.width, CARD_CONFIG.height, CARD_CONFIG.thickness, 32, CARD_CONFIG.radius
  );

  const cardColorObj = new THREE.Color(selectedColor);
  const selectedMaterialName = cardData.value.material;
  const physicsParams = MATERIAL_PHYSICS[selectedMaterialName] || { metalness: 0.8, roughness: 0.3 };

  const cardMaterial = new THREE.MeshStandardMaterial({
    map: baseTexture,
    color: cardColorObj,
    metalness: physicsParams.metalness,
    roughness: physicsParams.roughness,
  });

  const cardMaterials = [
    cardMaterial,
    cardMaterial,
    cardMaterial,
    cardMaterial,
    cardMaterial,
    cardMaterial
  ];

  cardMesh = new THREE.Mesh(geometry, cardMaterials);
  scene.add(cardMesh);

  const frontOverlayGeo = new THREE.PlaneGeometry(CARD_CONFIG.width, CARD_CONFIG.height);
  const frontOverlayMat = new THREE.MeshBasicMaterial({
    map: frontTexture,
    transparent: true,
    alphaTest: 0.01,
    side: THREE.FrontSide,
    depthWrite: false
  });
  frontOverlay = new THREE.Mesh(frontOverlayGeo, frontOverlayMat);
  frontOverlay.position.z = CARD_CONFIG.thickness / 2 + 0.001;
  cardMesh.add(frontOverlay);

  const backOverlayGeo = new THREE.PlaneGeometry(CARD_CONFIG.width, CARD_CONFIG.height);
  const backOverlayMat = new THREE.MeshBasicMaterial({
    map: backTexture,
    transparent: true,
    alphaTest: 0.01,
    side: THREE.FrontSide,
    depthWrite: false
  });
  backOverlay = new THREE.Mesh(backOverlayGeo, backOverlayMat);
  backOverlay.position.z = -CARD_CONFIG.thickness / 2 - 0.001;
  backOverlay.rotation.y = Math.PI;
  cardMesh.add(backOverlay);

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', handleResize);

  animate();

  setTimeout(() => {
    isLoading.value = false;
  }, 100);
}

function handleWheel(e) {
  e.preventDefault();
  camera.position.z += e.deltaY * 0.01;
  if (camera.position.z < 4) camera.position.z = 4;
  if (camera.position.z > 8) camera.position.z = 8;
}

function handleMouseMove(e) {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 0.6;
  targetRotationY = x * 3.5;
  targetRotationX = y * 0.5;
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  animateId = requestAnimationFrame(animate);
  if (cardMesh) {
    cardMesh.rotation.y += (targetRotationY - cardMesh.rotation.y) * 0.09;
    cardMesh.rotation.x += (targetRotationX - cardMesh.rotation.x) * 0.09;
  }
  renderer.render(scene, camera);
}

function cleanupThree() {
  if (animateId) cancelAnimationFrame(animateId);
  if (renderer) renderer.dispose();
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', handleResize);
}
</script>

<style scoped lang="scss">
.my-cards-page {
  width: 100vw;
  height: 100vh;
  background: #fff;
  position: absolute;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.loadingContainer {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.threeContainer {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.threeContainer canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.buttonGroup {
  display: flex;
  gap: 20px;
  position: fixed;
  top: 5%;
  left: 5%;
  transform: translateX(-50%);
  z-index: 10000 !important;
}

.back-profile-btn {
  padding: 12px 22px;
  background: #0056CC;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:hover {
    background: #0056CC;
    transform: translateY(-2px);
  }
}

.senceChange {
  position: relative;
  top: 85%;
  left: 40%;
  z-index: 9999 !important;
}

.empty-state {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  p {
    font-size: 24px;
    color: #86868b;
    margin-bottom: 40px;
  }
}

.design-btn {
  padding: 16px 40px;
  background: #007AFF;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #0056CC;
    transform: translateY(-2px);
  }
}
</style>

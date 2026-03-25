<template>
  <div class="design-page">
    <BlackHeader class="header" />
    <div class="leftArea" v-show="PageNumber < 5">
      <div class="Renderer">
        <!-- 👇 正面：用 frontData -->
        <div class="card front" :class="{ visible: isFront }" ref="frontcardRef" :style="{
          background: cardColor,
          backgroundImage: cardMaterialStyle.backgroundImage,
          boxShadow: cardMaterialStyle.boxShadow,
          opacity: cardMaterialStyle.opacity,
          backgroundBlendMode: cardMaterialStyle.backgroundBlendMode
        }">
          <div v-for="item in frontTextList" :key="item.id" class="drag-item" :style="{
            left: item.x + '%',
            top: item.y + '%',
            color: item.color,
            fontSize: item.fontSize + 'px',
          }" @mousedown="(e) => startDrag(e, item, 'front')">
            {{ item.text }}
          </div>

          <div v-for="(img, imgIndex) in frontImageList" :key="img.uid" class="drag-item img-container" :style="{
            left: img.x + '%',
            top: img.y + '%',
            width: img.scale + '%',
          }" @mousedown="(e) => startDrag(e, img, 'front')">
            <img :src="img.url" style="width:100%;height:auto;object-fit:contain" />
            <div class="img-scale-controls">
              <button class="scale-btn" @click.stop="adjustImageScale(imgIndex, -5, 'front')">-</button>
              <button class="scale-btn" @click.stop="adjustImageScale(imgIndex, 5, 'front')">+</button>
            </div>
          </div>
        </div>

        <!-- 👇 背面：用 backData，完全独立！ -->
        <div class="card back" :class="{ visible: !isFront }" ref="backcardRef" :style="{
          background: cardColor,
          backgroundImage: cardMaterialStyle.backgroundImage,
          boxShadow: cardMaterialStyle.boxShadow,
          opacity: cardMaterialStyle.opacity,
          backgroundBlendMode: cardMaterialStyle.backgroundBlendMode
        }">
          <div v-for="item in backTextList" :key="item.id" class="drag-item" :style="{
            left: item.x + '%',
            top: item.y + '%',
            color: item.color,
            fontSize: item.fontSize + 'px',
          }" @mousedown="(e) => startDrag(e, item, 'back')">
            {{ item.text }}
          </div>

          <div v-for="(img, imgIndex) in backImageList" :key="img.uid" class="drag-item img-container" :style="{
            left: img.x + '%',
            top: img.y + '%',
            width: img.scale + '%',
          }" @mousedown="(e) => startDrag(e, img, 'back')">
            <img :src="img.url" style="width:100%;height:auto;object-fit:contain" />
            <div class="img-scale-controls">
              <button class="scale-btn" @click.stop="adjustImageScale(imgIndex, -5, 'back')">-</button>
              <button class="scale-btn" @click.stop="adjustImageScale(imgIndex, 5, 'back')">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rightArea">
      <div class="colorContainer" v-show="PageNumber === 1">
        <div class="colorTitle">
          Appearance：
          <p class="p"> Choose the color you like.</p>
        </div>
        <p class="subTitle">Color: {{ colorNow }}</p>
        <div class="colorPicker" @click="colorClick">
          <el-button class="colorBtn btn1" data-color="Matte Black" style="margin-left:0;"></el-button>
          <el-button class="colorBtn btn2" data-color="Ivory White"></el-button>
          <el-button class="colorBtn btn3" data-color="Sierra Blue"></el-button>
          <el-button class="colorBtn btn4" data-color="Rose Gold"></el-button>
          <el-button class="colorBtn btn5" data-color="Cosmic Orange"></el-button>
          <RainbowButton @panelOpen="() => colorNow = 'Custom Color'" @colorChange="handleCustomColor"></RainbowButton>
        </div>
      </div>

      <div class="materialContainer" v-show="PageNumber === 2">
        <div class="materialTitle">
          Material：
          <p class="p"> select the material you like.</p>
        </div>
        <p class="materialSubTitle">Material: {{ materialNow }}</p>
        <div class="materialPicker" @click="materialPick">
          <div class="materialBtn" data-material="Matte Metal" style="display:inline-block;cursor:pointer;">
            <!-- 磨砂 -->
            <smoothButton></smoothButton>
          </div>
          <!-- 雾面/光滑 -->
          <div class="materialBtn" data-material="Satin Metal"
            style="display:inline-block;cursor:pointer;margin-left:30px;">
            <matteButton></matteButton>
          </div>
          <!-- 拉丝金属 -->
          <div class="materialBtn" data-material="Brushed Metal"
            style="display:inline-block;cursor:pointer;margin-left:30px;">
            <brushedMetal></brushedMetal>
          </div>
        </div>
      </div>

      <div class="frontForm" v-show="PageNumber === 3">
        <frontForm v-model:frontData="frontData"></frontForm>
      </div>

      <div class="backForm" v-show="PageNumber === 4">
        <backForm v-model:backData="backData"></backForm>
      </div>

      <el-button class="nextBtn" @click="handleClick" v-show="PageNumber < 5">
        <p>▶</p>Next
      </el-button>
    </div>
  </div>
  <!-- 加载状态 -->
  <div v-if="PageNumber === 5 && isLoading" class="loadingContainer">
    <loader />
  </div>
  <!-- 渲染结果 -->
  <div ref="threeContainer" class="threeContainer" v-show="PageNumber === 5 && !isLoading"></div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted, onMounted } from 'vue';
import BlackHeader from '@/components/BlackHeader.vue';
import RainbowButton from '@/components/rainbowButton.vue';
import brushedMetal from '@/components/BrushedMetal.vue';
import smoothButton from '@/components/SmoothButton.vue';
import matteButton from '@/components/matteButton.vue';
import frontForm from '@/components/frontForm.vue';
import backForm from '@/components/backForm.vue';
import * as THREE from 'three'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import html2canvas from 'html2canvas'
import loader from '@/components/loader.vue'


const PageNumber = ref(1);
const isClickDisabled = ref(false);
const colorNow = ref('');
const materialNow = ref('');
const cardColor = ref('#ffffff');
const cardMaterialStyle = ref({});
const isFront = ref(true);
const currentSide = ref('front');
const loading = ref(true)
const frontcardRef = ref(null);
const backcardRef = ref(null);
const isDragging = ref(false);
const currentItem = ref(null);
const dragOffset = ref({ x: 0, y: 0 });
let cardMesh = null;
const isLoading = ref(true);
//正面数据保存
const frontData = ref({
  texts: { FullName: '姓名', Position: '职位', Company: '公司', Telephone: '电话', Email: '邮箱' },
  colors: { FullName: '#fff', Position: '#fff', Company: '#fff', Telephone: '#fff', Email: '#fff' },
  sizes: [
    { id: 'FullName', fontSize: 28 },
    { id: 'Position', fontSize: 22 },
    { id: 'Company', fontSize: 20 },
    { id: 'Telephone', fontSize: 18 },
    { id: 'Email', fontSize: 18 }
  ],
  images: []
});
//背面数据保存
const backData = ref({
  texts: { Company: '公司', Address: '地址', SocialMedia: '社交账号', Slogan: '标语', Customtext: '自定义文字' },
  colors: { Company: '#fff', Address: '#fff', SocialMedia: '#fff', Slogan: '#fff', Customtext: '#fff' },
  sizes: [
    { id: 'Company', fontSize: 26 },
    { id: 'Address', fontSize: 18 },
    { id: 'SocialMedia', fontSize: 18 },
    { id: 'Slogan', fontSize: 22 },
    { id: 'Customtext', fontSize: 20 }
  ],
  images: []
});
//材质贴图库
const MATERIAL_MAP = {
  "Matte Metal": "/src/assets/素材/材质/磨砂.jpg",
  "Satin Metal": "/src/assets/素材/材质/光滑.jpg",
  "Brushed Metal": "/src/assets/素材/材质/拉丝.jpg"
}
const MATERIAL_PHYSICS = {
  "Matte Metal": { metalness: 0.95, roughness: 0.6 },   // 磨砂：高粗糙度，哑光
  "Satin Metal": { metalness: 1.0, roughness: 0.2 },     // 光滑：低粗糙度，锐利高光
  "Brushed Metal": { metalness: 0.95, roughness: 0.45 }  // 拉丝：中等粗糙度，配合贴图纹理
};

//卡片正面的设置
// 文字位置持久化 设定文字的初始位置
const frontTextPositions = ref({
  FullName: { x: 20, y: 20 },
  Position: { x: 20, y: 30 },
  Company: { x: 20, y: 40 },
  Telephone: { x: 20, y: 50 },
  Email: { x: 20, y: 60 }
});
//背面位置
const backTextPositions = ref({
  Company: { x: 20, y: 20 },
  Address: { x: 20, y: 30 },
  SocialMedia: { x: 20, y: 40 },
  Slogan: { x: 20, y: 50 },
  Customtext: { x: 20, y: 60 }
});

// 图片位置 + 缩放
const frontImagePositions = ref([]);
const backImagePositions = ref([]);

// 文字列表
const frontTextList = computed(() => {
  //如果没有传递值过来就不进行处理
  if (!frontData.value) return [];
  //如果有值传递进来 那么就给他一个对应的id 然后对对应的id进行处理
  return [
    { id: 'FullName' }, { id: 'Position' }, { id: 'Company' },
    { id: 'Telephone' }, { id: 'Email' }
    //遍历列表 找到对应的id 然后给列表返回改变后的文字 位置 大小
  ].map(item => {
    const text = frontData.value.texts[item.id] || '';
    const color = frontData.value.colors[item.id] || '#fff';
    const size = frontData.value.sizes.find(s => s.id === item.id)?.fontSize || 20;
    const pos = frontTextPositions.value[item.id];
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


//背面文字
const backTextList = computed(() => {
  //如果没有传递值过来就不进行处理
  if (!backData.value) return [];
  //如果有值传递进来 那么就给他一个对应的id 然后对对应的id进行处理
  return [
    { id: 'Company' }, { id: 'Address' }, { id: 'SocialMedia' },
    { id: 'Slogan' }, { id: 'Customtext' }
  ].map(item => {
    const text = backData.value.texts[item.id] || '';
    const color = backData.value.colors[item.id] || '#fff';
    const size = backData.value.sizes.find(s => s.id === item.id)?.fontSize || 20;
    const pos = backTextPositions.value[item.id];
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


// 图片列表 正面
const frontImageList = computed(() => {
  //如果列表为空就不进行处理
  if (!frontData.value?.images) return [];
  //如果列表有数据就遍历 找到对应的url地址和id
  return frontData.value.images.map((url, idx) => {
    //如果图片位置的值为空 就给默认位置
    if (!frontImagePositions.value[idx]) {
      frontImagePositions.value[idx] = { x: 10, y: 50, scale: 30 };
    }
    //定义一个p 存储图片位置的值
    const p = frontImagePositions.value[idx];
    //给列表返回改变后的图片地址 位置 大小
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

//背面
// 图片列表 背面
const backImageList = computed(() => {
  //如果列表为空就不进行处理
  if (!backData.value?.images) return [];
  //如果列表有数据就遍历 找到对应的url地址和id
  return backData.value.images.map((url, idx) => {
    //如果图片位置的值为空 就给默认位置
    if (!backImagePositions.value[idx]) {
      backImagePositions.value[idx] = { x: 10, y: 50, scale: 30 };
    }
    //定义一个p 存储图片位置的值
    const p = backImagePositions.value[idx];
    //给列表返回改变后的图片地址 位置 大小
    return {
      type: 'image',
      uid: 'img_' + idx,
      url,
      x: p.x,
      y: p.y,
      scale: p.scale
    };
  })
});


// 缩放函数
const adjustImageScale = (idx, delta, side) => {
  //正反面判断
  if (side === 'front') {
    //如果没有图片 就返回
    if (!frontImagePositions.value[idx]) return;
    //创建一个s 储存图片的缩放比例
    let s = frontImagePositions.value[idx].scale + delta;
    s = Math.max(10, Math.min(s, 80));
    frontImagePositions.value[idx].scale = s;
  } else {
    if (!backImagePositions.value[idx]) return;
    let s = backImagePositions.value[idx].scale + delta;
    s = Math.max(10, Math.min(s, 80));
    backImagePositions.value[idx].scale = s;
  }
};

// 拖拽
function startDrag(e, item, side) {
  //当你点击物体就出发拖拽函数 让拖拽的物品设置为true 设置当前物体被拖拽
  isDragging.value = true;
  currentItem.value = item;
  currentSide.value = side; // 关键：存是正面还是背面
  const rect = activeCardRef.value.getBoundingClientRect();
  //计算拖拽的偏移量
  dragOffset.value.x = e.clientX - (rect.left + item.x * rect.width / 100);
  dragOffset.value.y = e.clientY - (rect.top + item.y * rect.height / 100);
  //持续监听
  window.addEventListener('mousemove', onDrag, { passive: false });
  window.addEventListener('mouseup', stopDrag);
}

//拖拽时触发的函数
function onDrag(e) {
  //删除默认
  e.preventDefault();
  //如果没被拖拽 就不触发
  if (!isDragging.value) return;
  //存储当前拖拽的物品
  const it = currentItem.value;
  //存储当前拖拽的物品是正面还是背面
  const side = currentSide.value;
  //获取卡片的位置
  const rect = activeCardRef.value.getBoundingClientRect();
  //计算拖拽的位置
  let x = ((e.clientX - rect.left - dragOffset.value.x) / rect.width) * 100;
  let y = ((e.clientY - rect.top - dragOffset.value.y) / rect.height) * 100;
  //限制拖拽的位置在卡片内
  x = Math.max(0, Math.min(x, 100));
  y = Math.max(0, Math.min(y, 100));

  // 判断改正面还是背面数据
  if (it.type === 'text') {
    if (side === 'front') {
      frontTextPositions.value[it.id].x = x;
      frontTextPositions.value[it.id].y = y;
    } else {
      backTextPositions.value[it.id].x = x;
      backTextPositions.value[it.id].y = y;
    }
  } else {
    const idx = parseInt(it.uid.split('_')[1]);
    if (side === 'front') {
      frontImagePositions.value[idx].x = x;
      frontImagePositions.value[idx].y = y;
    } else {
      backImagePositions.value[idx].x = x;
      backImagePositions.value[idx].y = y;
    }
  }
}


function stopDrag() {
  //当你鼠标up就出发停止函数 让拖拽的物品设置为false停止触发拖拽
  isDragging.value = false;
  //持续监听
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
}


// 新增：获取当前激活的卡片 DOM
const activeCardRef = computed(() => {
  return isFront.value ? frontcardRef.value : backcardRef.value;
});

// 卡片数据
const cardRenderData = ref({
  backgroundColor: '',
  material: '',
  size: { width: 550, height: 347, borderRadius: 20, ratio: 1.5858 }
});

// 颜色
//点击触发颜色函数
const colorClick = (e) => {
  //把当前的颜色的值赋值给colorNow.value以及颜色转换为十六进制颜色
  colorNow.value = e.target.dataset.color;
  const btn = e.target.closest('.colorBtn');
  if (!btn) return;
  const rgb = getComputedStyle(btn).backgroundColor;
  const hex = (r, g, b) => `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
  const [r, g, b] = rgb.match(/\d+/g) || [];
  cardColor.value = hex(r, g, b);
  cardRenderData.value.backgroundColor = cardColor.value;
};

const handleCustomColor = (hex) => {
  cardColor.value = hex;
  cardRenderData.value.backgroundColor = hex;
};

// css材质
const materialStyleLib = {
  'Matte Metal': {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.015) 1px, transparent 2px, transparent 3px),
      repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.02) 1px, transparent 2px, transparent 3px),
      linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)
    `,
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.18), inset 0 -1px 6px rgba(255,255,255,0.1), 0 5px 20px rgba(0,0,0,0.25)',
    opacity: 0.98,
    backgroundBlendMode: 'multiply'
  },
  'Satin Metal': {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.04) 1px, transparent 2px, transparent 3px),
      linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 20%, transparent 50%, rgba(0,0,0,0.15) 80%)
    `,
    boxShadow: 'inset 0 3px 12px rgba(255,255,255,0.7), inset 0 -2px 8px rgba(0,0,0,0.25), 0 8px 30px rgba(0,0,0,0.3)',
    opacity: 1,
    backgroundBlendMode: 'overlay'
  },
  'Brushed Metal': {
    backgroundImage: `
      linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, transparent 50%, rgba(0,0,0,0.12) 70%),
      repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(0,0,0,0.06) 2px, transparent 3px)
    `,
    boxShadow: 'inset 0 4px 14px rgba(255,255,255,0.6), inset 0 -3px 12px rgba(0,0,0,0.2), 0 7px 30px rgba(0,0,0,0.38)',
    opacity: 1,
    backgroundBlendMode: 'soft-light'
  }
};
//材质选择
const materialPick = (e) => {
  //点击触发材质函数
  const element = e.target.closest('[data-material]');
  //如果选择了材质
  if (element) {
    //获取当前点击的材质名称
    const name = element.dataset.material;
    //文字显示当前点击的材质名称
    materialNow.value = name;
    //给卡片添加对应css材质样式
    cardMaterialStyle.value = materialStyleLib[name];
    //把材质贴图名字找到 后面渲染
    cardRenderData.value.material = name;
  }
};

// 下一步
const handleClick = () => {
  if (isClickDisabled.value) return;
  isClickDisabled.value = true;
  PageNumber.value++;
  setTimeout(() => isClickDisabled.value = false, 500);
  if (PageNumber.value === 4) {
    isFront.value = false;

  } else if (PageNumber.value === 3) {
    isFront.value = true;
  }
};

//threejs区域

//贴图转换函数 会把编辑的信息变成贴图
function domToTexture(side) {
  // 创建一个临时容器，只包含文字和图片
  const container = document.createElement('div');
  //设置容器样式
  container.style.position = 'fixed';
  //给他藏到页面外
  container.style.left = '-9999px';
  container.style.top = '0';
  //跟卡片一样大
  container.style.width = '550px';
  container.style.height = '347px';
  //透明的背景
  container.style.backgroundColor = 'transparent';
  container.style.zIndex = '-9999';

  // 判断正面还是反面 就给对应的数据
  const textList = side === 'front' ? frontTextList.value : backTextList.value;
  const imageList = side === 'front' ? frontImageList.value : backImageList.value;

  //遍历对应的textlist 获取文字 位置 颜色 大小 字体
  // 添加文字元素 之前存储的文字和图片都是有坐标和大小的 然后呢根据这些数据来还原文字
  textList.forEach(item => {
    const textEl = document.createElement('div');
    textEl.textContent = item.text;
    textEl.style.position = 'absolute';
    textEl.style.left = item.x + '%';
    textEl.style.top = (item.y + 1) + '%';
    textEl.style.color = item.color;
    textEl.style.fontSize = item.fontSize + 'px';
    textEl.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    textEl.style.whiteSpace = 'nowrap';
    textEl.style.userSelect = 'none';
    container.appendChild(textEl);
  });

  //获取图片 位置 大小
  // 添加图片元素 之前存储的文字和图片都是有坐标和大小的 然后呢根据这些数据来还原图片
  imageList.forEach(img => {
    const imgEl = document.createElement('div');
    imgEl.style.position = 'absolute';
    imgEl.style.left = (img.x - 1.5) + '%';
    // 添加Y轴补偿，修正3D中图片偏上的问题
    imgEl.style.top = (img.y + 1.9) + '%';
    imgEl.style.width = img.scale + '%';
    imgEl.style.height = 'auto';
    imgEl.style.overflow = 'visible';
    imgEl.style.padding = '0';
    imgEl.style.margin = '0';
    imgEl.style.lineHeight = '0';

    const imgTag = document.createElement('img');
    imgTag.src = img.url;
    imgTag.style.width = '100%';
    imgTag.style.height = 'auto';
    imgTag.style.objectFit = 'contain';
    imgTag.style.display = 'block';
    imgTag.style.verticalAlign = 'top';
    imgEl.appendChild(imgTag);

    container.appendChild(imgEl);
  });

  // 添加到DOM
  document.body.appendChild(container);

  //HTML2canvas 获取那个容器 然后截图
  return new Promise((resolve) => {
    html2canvas(container, {
      //渲染倍数
      scale: 2,
      //跨域加载
      useCORS: true,
      //透明
      backgroundColor: null,
      //跨域允许
      allowTaint: true,
      //贴图大小
      width: 550,
      height: 347
    }).then(canvas => {
      // 移除临时容器
      document.body.removeChild(container);
      // 截图转换为贴图
      const texture = new THREE.CanvasTexture(canvas);
      //响应式刷新贴图
      texture.needsUpdate = true;
      // 翻转Y轴
      texture.flipY = true;
      //返回贴图 你哪里调用就返回给你最终的贴图
      resolve(texture);
    });
  });
}

//threejs渲染器
const threeContainer = ref(null)
let scene, camera, renderer, animateId
let targetRotationY = 0, targetRotationX = 0
let frontOverlay, backOverlay
// 卡片配置
const CARD_CONFIG = {
  width: 5.5,
  height: 3.47,
  thickness: 0.18,
  radius: 0.2,
  metalness: 0.75,
  roughness: 0.3,
}

// 监听页面切换 页面等于5 开始渲染threejs
watch(PageNumber, (val) => {
  if (val === 5) {
    // 立即设置为加载状态
    isLoading.value = true;
    setTimeout(() => initThree(), 100)
  } else {
    // 当离开第5页时，重置加载状态
    isLoading.value = true;
  }
})
//异步等待贴图生成完了开始渲染threejs
async function initThree() {

  //获取threejs容器
  const container = threeContainer.value
  //没加载出来容器 就直接返回
  if (!container) return
  // 清空容器
  container.innerHTML = ''

  // 场景
  scene = new THREE.Scene()

  // 加载 HDR
  const hdrLoader = new RGBELoader()
  hdrLoader.load('/src/assets/素材/材质/environment.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    //加载hdr贴图的环境光和背景
    scene.environment = texture
    scene.background = texture
    loading.value = false;
  })

  // 相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 9)
  camera.lookAt(0, 0, 0)

  // 滚轮缩放 + 距离限制
  window.addEventListener('wheel', (e) => {
    e.preventDefault()
    camera.position.z += e.deltaY * 0.01

    // 限制最近距离（不能贴太近）
    if (camera.position.z < 4) camera.position.z = 4
    // 限制最远距离（不能拉太远）
    if (camera.position.z > 8) camera.position.z = 8
  }, { passive: false })

  // 渲染器以及曝光设置
  //光滑边缘 背景不透明
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  //铺满窗口
  renderer.setSize(window.innerWidth, window.innerHeight)
  //自适应设置像素比 最高三倍渲染
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))
  //电影调色
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  //曝光度
  renderer.toneMappingExposure = 2
  //使用标准颜色空间
  renderer.outputColorSpace = THREE.SRGBColorSpace
  //渲染好的场景添加到容器中
  container.appendChild(renderer.domElement)

  // 灯光
  // 主光源
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  // 环境光
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  // 材质：贴上贴图
  // 加载材质贴图
  const textureLoader = new THREE.TextureLoader()
  //获取之前选择的颜色色号
  const selectedColor = cardRenderData.value.backgroundColor
  //根据名字获取材质贴图
  const selectMaterialImg = MATERIAL_MAP[cardRenderData.value.material]
  // 加载材质贴图
  const baseTexture = textureLoader.load(selectMaterialImg)
  baseTexture.colorSpace = THREE.SRGBColorSpace

  let frontTexture, backTexture
  //异步等待
  await Promise.all([
    domToTexture('front').then(t => frontTexture = t),
    domToTexture('back').then(t => backTexture = t)
  ])
  // 文字图片翻转Y轴已在domToTexture中设置

  // 卡片模型 就是个标注几何体但是长宽厚要之前的
  const geometry = new RoundedBoxGeometry(
    CARD_CONFIG.width, CARD_CONFIG.height, CARD_CONFIG.thickness, 32, CARD_CONFIG.radius
  )


  // 确保颜色能正确显示
  const cardColorObj = new THREE.Color(selectedColor);

  // 只创建一次材质（6个面共用）
  const selectedMaterialName = cardRenderData.value.material;

  const physicsParams = MATERIAL_PHYSICS[selectedMaterialName] || { metalness: 0.8, roughness: 0.3 };

  // 只创建一次材质（6个面共用）
  const cardMaterial = new THREE.MeshStandardMaterial({
    map: baseTexture,
    color: cardColorObj,
    // ✅ 使用动态计算的数值
    metalness: physicsParams.metalness,
    roughness: physicsParams.roughness,
  });

  // 6个面都用同一个材质
  const cardMaterials = [
    cardMaterial,
    cardMaterial,
    cardMaterial,
    cardMaterial,
    cardMaterial,
    cardMaterial
  ];

  // 创建卡片主体（6个面）
  cardMesh = new THREE.Mesh(geometry, cardMaterials)
  scene.add(cardMesh)

  // 添加正面文字图片层（作为cardMesh的子节点）
  //创建一个屏幕和卡片一样大但是很薄
  const frontOverlayGeo = new THREE.PlaneGeometry(CARD_CONFIG.width, CARD_CONFIG.height);
  const frontOverlayMat = new THREE.MeshBasicMaterial({
    map: frontTexture,//贴上正面文字图片层
    transparent: true,//透明背景
    alphaTest: 0.01,//让边缘更干净
    side: THREE.FrontSide,//只在正面显示
    depthWrite: false//防止和主体反光重合
  });
  //图层合并
  frontOverlay = new THREE.Mesh(frontOverlayGeo, frontOverlayMat);
  //不让文字和卡片重合
  frontOverlay.position.z = CARD_CONFIG.thickness / 2 + 0.001;
  ///同步旋转
  cardMesh.add(frontOverlay);

  // 添加背面文字图片层（作为cardMesh的子节点）
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

  // 鼠标旋转
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 0.6
    targetRotationY = x * 3.5
    targetRotationX = y * 0.5
  })

  // 窗口大小调整
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // 开始动画
  animate()

  // 渲染完成，关闭加载状态
  setTimeout(() => {
    isLoading.value = false;
  }, 100);
}

// 卡片微微旋转动画循环
function animate() {
  animateId = requestAnimationFrame(animate)
  if (cardMesh) {
    cardMesh.rotation.y += (targetRotationY - cardMesh.rotation.y) * 0.09
    cardMesh.rotation.x += (targetRotationX - cardMesh.rotation.x) * 0.09
  }
  renderer.render(scene, camera)
}

//生命周期函数：组件卸载时清理动画和渲染器
onUnmounted(() => {
  if (animateId) cancelAnimationFrame(animateId)
  if (renderer) renderer.dispose()
})
</script>

<style scoped lang="scss">
.design-page {
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  position: absolute;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.leftArea {
  width: 50%;
  height: 100%;
  position: relative;
}

.Renderer {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 550px;
  background: #F5F5F7;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card {
  position: absolute;
  overflow: hidden;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 550px;
  height: 347px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1;

  &.visible {
    opacity: 1;
    pointer-events: all;
    z-index: 999;
  }
}

.drag-item {
  position: absolute;
  cursor: move;
  user-select: none;
  white-space: nowrap;
}

.img-container {
  position: relative;
  overflow: visible !important;
  /* 扩大可点击区域！！！ */
  padding: 10px;
}

.img-scale-controls {
  position: absolute;
  top: 0px;
  right: 0px;
  display: none;
  gap: 4px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 6px;
  border-radius: 6px;
  z-index: 999;
}

/* 关键：只要 hover 图片所在的容器，按钮就显示 */
.img-container:hover .img-scale-controls {
  display: flex !important;
}

.scale-btn {
  width: 18px;
  height: 18px;
  font-size: 12px;
  background: transparent;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rightArea {
  width: 50%;
  height: 100%;
  padding-left: 80px;
  display: flex;
  align-items: center;
  position: relative;
}

.nextBtn {
  position: absolute;
  right: 80px;
  bottom: 80px;
  width: 117px;
  height: 54px;
  background: #0088FF;
  color: #fff;
  border-radius: 999px;
  font-size: 22px;
  z-index: 99;
}

.colorContainer,
.materialContainer {
  width: 600px;
  height: 290px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;

}

.colorTitle,
.materialTitle {
  font-size: 28px;
  font-weight: bold;
  display: flex;

}

.p {
  color: #86868B;
  margin-left: 8px;
}

.subTitle,
.materialSubTitle {
  font-size: 26px;
  font-weight: bold;
}

.colorPicker,
.materialPicker {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 20px;
}

.colorBtn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
}

.btn1 {
  background: #2a292a;
}

.btn2 {
  background: #fffbf0;
}

.btn3 {
  background: #96b0c8;
}

.btn4 {
  background: #f8e4c8;
}

.btn5 {
  background: #f77e2d;
}

.frontForm {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
</style>

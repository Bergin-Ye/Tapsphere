<template>
  <div class="front-container">
    <div class="frontTitle">Please enter your information</div>

    <div class="input-container">
      <div class="input-item" v-for="(item, index) in inputItems" :key="index">
        <label class="label" :for="item.id">{{ item.label }}</label>

        <!-- 布局核心：使用 Flexbox 让输入框和彩虹按钮横向排列 -->
        <div class="input-row">

          <!-- 1. 输入框区域 (包含内部的大小按钮) -->
          <div class="input-wrapper">
            <input v-model="inputValues[item.id]" autocomplete="off" :name="item.id" :id="item.id" class="input-field"
              :type="item.type">
            <!-- 大小按钮：绝对定位在 input-wrapper 内部靠右 -->
            <button class="size-control-btn" @click.stop="() => openFontSizePanel(index)" type="button"
              aria-label="Change font size">
              <img :src="icon" alt="Size" class="size-icon">
            </button>
          </div>

          <!-- 2. 彩虹按钮区域 (在外部，自动保持间距) -->
          <div class="color-control-wrapper">
            <RainbowButton v-model="currentColor[item.id]" @colorChange="(color) => onColorPicked(index, color)" />
          </div>

        </div>
      </div>
    </div>

    <div class="upload-section">
      <el-upload action="#" list-type="picture-card" :auto-upload="false" v-model:file-list="uploadFileList"
        :file-list="uploadFileList" :on-remove="handleRemove" :limit="2" :on-change="handleChange" class="custom-upload"
        :disabled="uploadFileList.length >= 2">
        <el-icon>
          <Plus />
        </el-icon>

        <template #file="{ file }">
          <div class="upload-item">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span class="action-icon" @click="handlePictureCardPreview(file)">
                <el-icon>
                  <ZoomIn />
                </el-icon>
              </span>
              <span v-if="!disabled" class="action-icon" @click="handleDownload(file)">
                <el-icon>
                  <Download />
                </el-icon>
              </span>
              <span v-if="!disabled" class="action-icon" @click.stop="() => handleRemove(file)">
                <el-icon>
                  <Delete />
                </el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img class="preview-img" :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </div>

    <!-- 字体大小选择面板 -->
    <div class="font-size-modal" v-if="showFontPanel" @click.stop>
      <div class="modal-content">
        <div class="modal-title">Please select the font size</div>
        <div class="size-grid">
          <button class="size-option" :class="{ active: selectedFontSize === size }" v-for="size in fontSizeOptions"
            :key="size" @click="setFontSize(size)" type="button">
            {{ size }}px
          </button>
        </div>
        <button class="modal-close" @click="showFontPanel = false" type="button">close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue';
import RainbowButton from '@/components/rainbowButton.vue';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';

// --- 逻辑部分保持不变 ---
const emit = defineEmits(['update:frontData']);

const inputValues = ref({
  FullName: '',
  Position: '',
  Company: '',
  Telephone: '',
  Email: ''
});

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);
const uploadFileList = ref([]);

const handleRemove = (file) => {
  const fileIndex = uploadFileList.value.findIndex(item => item.uid === file.uid);
  if (fileIndex !== -1) {
    uploadFileList.value.splice(fileIndex, 1);
  }
};

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

const handleDownload = (file) => {
  console.log('下载文件：', file);
};

const handleChange = (file, fileList) => {
  if (file.status === 'ready') {
    if (fileList.length > 3) {
      uploadFileList.value = fileList.slice(0, 3);
      return;
    }
    uploadFileList.value = fileList;
  }
};

const icon = new URL('@/assets/fonts/size.svg', import.meta.url).toString();

const inputItems = ref([
  { id: 'FullName', label: 'Full name', type: 'text', fontSize: 16 },
  { id: 'Position', label: 'Position', type: 'text', fontSize: 16 },
  { id: 'Company', label: 'Company', type: 'text', fontSize: 16 },
  { id: 'Telephone', label: 'Telephone', type: 'tel', fontSize: 16 },
  { id: 'Email', label: 'Email address', type: 'email', fontSize: 16 },
]);

const showFontPanel = ref(false);
const activeInputIndex = ref(-1);
const fontSizeOptions = ref([20, 26, 28, 30, 32, 34, 36, 40]);
const selectedFontSize = ref(20);

const currentColor = ref({
  FullName: '#FFFFFF',
  Position: '#FFFFFF',
  Company: '#FFFFFF',
  Telephone: '#FFFFFF',
  Email: '#FFFFFF'
});

const onColorPicked = (index, color) => {
  currentColor.value[inputItems.value[index].id] = color;
};

const openFontSizePanel = (index) => {
  activeInputIndex.value = index;
  selectedFontSize.value = inputItems.value[index].fontSize;
  showFontPanel.value = true;
};

const setFontSize = (size) => {
  if (activeInputIndex.value === -1) return;
  inputItems.value[activeInputIndex.value].fontSize = size;
  showFontPanel.value = false;
};

watch(
  [inputValues, currentColor, inputItems, uploadFileList],
  () => {
    emit('update:frontData', {
      texts: { ...inputValues.value },
      colors: { ...currentColor.value },
      sizes: inputItems.value,
      images: uploadFileList.value.map(f => f.url)
    });
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
.front-container {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 30%;
}

.frontTitle {
  font-size: 28px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 30px;
  margin-top: 20px;
  text-align: left;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: #86868b;
  margin-left: 4px;
}

/* 核心布局行：Flexbox */
.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  /* 输入框与彩虹按钮之间的间距 */
  width: 100%;
}

/* 输入框包装器：相对定位，作为大小按钮的容器 */
.input-wrapper {
  position: relative;
  flex: 1;
  /* 占据剩余宽度 */
  display: flex;
  align-items: center;
}

/* 原生输入框样式 */
.input-field {
  width: 100%;
  height: 48px;
  background: #f2f2f7;
  border-radius: 12px;
  border: none;
  padding: 0 45px 0 16px;
  /* 关键：右侧留出 45px 空间给内部按钮 */
  font-size: 16px;
  color: #1d1d1f;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    background: #e5e5ea;
    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
  }

  &::placeholder {
    color: #c7c7cc;
  }
}

/* 内部大小按钮：绝对定位 */
.size-control-btn {
  position: absolute;
  right: 10px;
  /* 靠右 */
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 2;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
}

.size-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  pointer-events: none;
}

/* 外部彩虹按钮容器 */
.color-control-wrapper {
  flex-shrink: 0;
  /* 防止被压缩 */
  display: flex;
  align-items: center;
}

/* 上传区域样式 */
.upload-section {
  margin-top: 40px;
}

.custom-upload {
  :deep(.el-upload-list__item) {
    transition: all 0.3s;
    border-radius: 8px;
    overflow: hidden;
  }

  :deep(.el-upload--picture-card) {
    background-color: #f2f2f7;
    border: 2px dashed #d1d1d6;
    border-radius: 12px;
  }
}

.upload-item {
  position: relative;
  width: 100%;
  height: 100%;

  .el-upload-list__item-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
  gap: 15px;

  .action-icon {
    cursor: pointer;
    color: #fff;
    font-size: 20px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }
}

.el-upload-list__item:hover .el-upload-list__item-actions {
  opacity: 1;
}

.preview-img {
  width: 100%;
  display: block;
}

/* 字体大小弹窗样式 */
.font-size-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1d1d1f;
}

.size-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}

.size-option {
  padding: 8px 12px;
  border: 1px solid #e5e5ea;
  border-radius: 8px;
  background: #f2f2f7;
  color: #1d1d1f;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: #007aff;
    color: #fff;
    border-color: #007aff;
    font-weight: 500;
  }

  &:hover:not(.active) {
    background: #e5e5ea;
  }
}

.modal-close {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #f2f2f7;
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e5e5ea;
  }
}

/* 响应式适配 */
@media (max-width: 480px) {
  .front-container {
    padding: 15px;
  }

  .input-row {
    gap: 10px;
  }

  .input-field {
    height: 44px;
    padding: 0 40px 0 12px;
    /* 移动端稍微减小内边距 */
    font-size: 14px;
  }

  .size-control-btn {
    width: 28px;
    height: 28px;
    right: 8px;
  }

  .size-icon {
    width: 18px;
    height: 18px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

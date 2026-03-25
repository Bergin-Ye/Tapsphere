<template>
  <div class="frontTitle">Please enter your information</div>

  <div class="input-container">
    <div class="input-item" v-for="(item, index) in inputItems" :key="index">
      <label class="label" :for="item.id">{{ item.label }}</label>

      <div class="input-with-color-btn">
        <div class="input-wrapper">
          <input v-model="inputValues[item.id]" autocomplete="off" :name="item.id" :id="item.id" class="input"
            :type="item.type">
          <button class=" font-size-btn" @click.stop="() => openFontSizePanel(index)">
            <img :src="icon" alt="大小" class="font-size-icon">
          </button>
        </div>

        <div class="color-btn-wrapper">
          <!-- 使用集成了颜色面板的彩虹按钮 -->
          <RainbowButton v-model="currentColor[item.id]" @colorChange="(color) => onColorPicked(index, color)" />
        </div>
      </div>
    </div>
  </div>

  <div class="upload">
    <!-- 把上传的图片传递给父组件 -->
    <el-upload action="#" list-type="picture-card" :auto-upload="false" v-model:file-list="uploadFileList"
      :file-list="uploadFileList" :on-remove="handleRemove" :limit="2" :on-change="handleChange"
      class="upload-component" :disabled="uploadFileList.length >= 2">
      <el-icon>
        <Plus />
      </el-icon>

      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <el-icon>
                <ZoomIn />
              </el-icon>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
              <el-icon>
                <Download />
              </el-icon>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click.stop="() => handleRemove(file)">
              <el-icon>
                <Delete />
              </el-icon>
            </span>
          </span>
        </div>
      </template>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <!-- 修复：把w-full改成标准CSS样式width: 100% -->
      <img style="width: 100%;" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>

  <div class="font-size-panel" v-if="showFontPanel" @click.stop>
    <div class="panel-title">Please select the font size</div>
    <div class="size-options">
      <button class="size-btn" :class="{ active: selectedFontSize === size }" v-for="size in fontSizeOptions"
        :key="size" @click="setFontSize(size)">
        {{ size }}px
      </button>
    </div>
    <button class="close-btn" @click="showFontPanel = false">close</button>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue';
// 注意：确保RainbowButton组件路径正确，否则会报错
import RainbowButton from '@/components/rainbowButton.vue';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';


//表单存储 以及传值给父组件
const emit = defineEmits(['update:frontData']);

const inputValues = ref({
  FullName: '',
  Position: '',
  Company: '',
  Telephone: '',
  Email: ''
});

// 图片预览相关
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);

// 核心：文件列表（修复删除功能的关键）
const uploadFileList = ref([]);

// 删除文件逻辑
const handleRemove = (file) => {
  console.log('删除的文件：', file);
  // 通过uid唯一标识找到并删除文件
  const fileIndex = uploadFileList.value.findIndex(item => item.uid === file.uid);
  if (fileIndex !== -1) {
    uploadFileList.value.splice(fileIndex, 1);
  }
};

// 预览图片
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

// 下载文件（可补充实际下载逻辑）
const handleDownload = (file) => {
  console.log('下载文件：', file);
  // 示例：实际下载逻辑
  // if (file.url) {
  //   const a = document.createElement('a');
  //   a.href = file.url;
  //   a.download = file.name || 'image';
  //   a.click();
  // }
};

// 处理文件上传
const handleChange = (file, fileList) => {
  // 当选择文件时，更新文件列表
  if (file.status === 'ready') {
    // 检查是否超过限制
    if (fileList.length > 3) {
      // 超过限制时，只保留前3个文件
      uploadFileList.value = fileList.slice(0, 3);
      return;
    }
    uploadFileList.value = fileList;
  }
};

// 字体大小和颜色相关
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
const fontSizeOptions = ref([20, 24, 26, 28, 30, 32, 34, 36, 40]);
const selectedFontSize = ref(20);

const currentColor = ref({
  FullName: '#FFFFFF',
  Position: '#FFFFFF',
  Company: '#FFFFFF',
  Telephone: '#FFFFFF',
  Email: '#FFFFFF'
});

// 颜色选择回调
const onColorPicked = (index, color) => {
  console.log(inputItems.value[index].label, ':', color);
  currentColor.value[inputItems.value[index].id] = color // 加这行
};

// 打开字体大小选择面板
const openFontSizePanel = (index) => {
  activeInputIndex.value = index;
  selectedFontSize.value = inputItems.value[index].fontSize;
  showFontPanel.value = true;
};

// 设置字体大小
const setFontSize = (size) => {
  if (activeInputIndex.value === -1) return;
  inputItems.value[activeInputIndex.value].fontSize = size;
  showFontPanel.value = false;
};




//监听这几个变量的变化 然后传递给父组件
watch(
  [inputValues, currentColor, inputItems, uploadFileList],
  () => {
    emit('update:frontData', {
      // 把这几个值传递给父组件
      texts: { ...inputValues.value },
      colors: { ...currentColor.value },
      sizes: inputItems.value,
      // 图片：只传 url，方便主页面使用
      images: uploadFileList.value.map(f => f.url)
    })
  },
  { deep: true, immediate: true }
)

</script>

<style scoped lang="scss">
// 基础样式
.frontTitle {
  font-size: 28px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 1.2rem;
  margin-top: 100px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.input-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-with-color-btn {
  display: flex;
  align-items: center;
  gap: 24px;
}

.input-wrapper {
  position: relative;
}

.input {
  width: 300px;
  height: 44px;
  background: #f2f2f7;
  border-radius: 10px;
  padding: 0 3rem 0 1rem;
  border: none;
  font-size: 1rem;
  color: #1d1d1f;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background: #e5e5ea;
  }
}

.font-size-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.font-size-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.color-btn-wrapper {
  position: relative;
}

// 彩虹按钮样式由组件内部提供

.label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #86868b;
}

.input-item:hover .input {
  background: #e5e5ea;
}

.input:focus+.label {
  color: #1d1d1f;
}

.font-size-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.panel-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1d1d1f;
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.size-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid #d1d1d6;
  border-radius: 6px;
  background: #f2f2f7;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: #007aff;
    color: #fff;
    border-color: #007aff;
  }

  &:hover {
    background: #e5e5ea;
  }
}

.close-btn {
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background: #f2f2f7;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e5ea;
  }
}

.upload {
  margin-top: 30px;
}

/* 控制上传按钮的显示和隐藏 */
.upload-component {
  position: relative;
}

/* 当文件列表长度为3时，隐藏上传按钮 */
.upload-component:has(.el-upload-list__item:nth-child(3)) .el-upload--picture-card {
  display: none;
}
</style>

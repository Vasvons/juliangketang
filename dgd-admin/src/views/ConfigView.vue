<template>
  <div class="page-container">
    <div class="page-header">
      <h2>页面配置</h2>
      <el-button type="primary" @click="handleSave" :loading="saving">保存配置</el-button>
    </div>

    <el-form :model="form" label-width="160px">
      <el-form-item label="卡密激活页会员介绍">
        <el-input
          v-model="form.activation_page_intro"
          type="textarea"
          :rows="8"
          placeholder="支持 HTML，将展示在卡密激活页"
        />
      </el-form-item>
      <el-form-item label="卡密激活页二维码">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :http-request="(options) => handleUpload(options, 'activation_page_qrcode')"
          accept="image/*"
        >
          <el-image
            v-if="form.activation_page_qrcode"
            :src="form.activation_page_qrcode"
            class="upload-preview"
            fit="cover"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="联系客服二维码">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :http-request="(options) => handleUpload(options, 'customer_service_qrcode')"
          accept="image/*"
        >
          <el-image
            v-if="form.customer_service_qrcode"
            :src="form.customer_service_qrcode"
            class="upload-preview"
            fit="cover"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="关于我们二维码">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :http-request="(options) => handleUpload(options, 'about_us_qrcode')"
          accept="image/*"
        >
          <el-image
            v-if="form.about_us_qrcode"
            :src="form.about_us_qrcode"
            class="upload-preview"
            fit="cover"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-divider content-position="left">欢迎弹窗</el-divider>

      <el-form-item label="启用欢迎弹窗">
        <el-switch v-model="form.welcome_popup_enabled" />
        <span class="form-tip">开启后，小程序每次进入都会弹出设置的内容</span>
      </el-form-item>
      <el-form-item label="弹窗标题">
        <el-input
          v-model="form.welcome_popup_title"
          maxlength="30"
          show-word-limit
          placeholder="例如：欢迎光临"
        />
      </el-form-item>
      <el-form-item label="弹窗内容">
        <el-input
          v-model="form.welcome_popup_content"
          type="textarea"
          :rows="6"
          placeholder="输入弹窗正文内容，支持换行"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getConfig, updateConfig } from '@/api/config'
import { uploadImage } from '@/api/upload'

const form = reactive({
  activation_page_intro: '',
  activation_page_qrcode: '',
  customer_service_qrcode: '',
  about_us_qrcode: '',
  welcome_popup_enabled: false,
  welcome_popup_title: '',
  welcome_popup_content: ''
})

const saving = ref(false)

const fetchConfig = async () => {
  try {
    const res = await getConfig()
    const data = res.data || {}
    const normalized = {
      ...data,
      // 后端存 '1'/'0'，前端用布尔
      welcome_popup_enabled: ['1', 'true', true].includes(data.welcome_popup_enabled)
    }
    Object.assign(form, normalized)
  } catch (error) {
    ElMessage.error('获取配置失败')
  }
}

const handleUpload = async ({ file }, field) => {
  try {
    const res = await uploadImage(file)
    form[field] = res.data.data.url
    ElMessage.success('上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    const payload = {
      ...form,
      welcome_popup_enabled: form.welcome_popup_enabled ? '1' : '0'
    }
    await updateConfig(payload)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-preview {
  width: 160px;
  height: 160px;
}

.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}
</style>

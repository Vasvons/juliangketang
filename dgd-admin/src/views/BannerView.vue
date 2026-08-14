<template>
  <div class="page-container">
    <div class="page-header">
      <h2>Banner 管理</h2>
      <el-button type="primary" @click="handleAdd">新增 Banner</el-button>
    </div>

    <el-table :data="bannerList" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="图片" width="200">
        <template #default="{ row }">
          <el-image
            :src="row.image"
            style="width: 160px; height: 80px"
            fit="cover"
            :preview-src-list="[row.image]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            size="small"
            :type="row.status === 'active' ? 'info' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'active' ? '下架' : '上架' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑 Banner' : '新增 Banner'"
      width="600px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="handleUpload"
            accept="image/png,image/jpeg,image/gif,image/webp"
          >
            <el-image
              v-if="form.image"
              :src="form.image"
              class="upload-preview"
              fit="cover"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="active">上架</el-radio>
            <el-radio label="disabled">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBannerList,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerStatus
} from '@/api/banner'
import { uploadImage } from '@/api/upload'

const bannerList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const form = reactive({
  image: '',
  sort_order: 0,
  status: 'active'
})

const resetForm = () => {
  form.image = ''
  form.sort_order = 0
  form.status = 'active'
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getBannerList()
    bannerList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取 Banner 列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentId.value = row.id
  form.image = row.image
  form.sort_order = row.sort_order
  form.status = row.status
  dialogVisible.value = true
}

const handleUpload = async ({ file }) => {
  try {
    const res = await uploadImage(file)
    form.image = res.data.data.url
    ElMessage.success('上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

const handleSubmit = async () => {
  if (!form.image) {
    ElMessage.warning('请上传图片')
    return
  }
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateBanner(currentId.value, form)
    } else {
      await createBanner(form)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchList()
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    submitting.value = false
  }
}

const handleToggleStatus = async (row) => {
  try {
    const newStatus = row.status === 'active' ? 'disabled' : 'active'
    await updateBannerStatus(row.id, { status: newStatus })
    ElMessage.success('操作成功')
    fetchList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该 Banner 吗？', '提示', {
      type: 'warning'
    })
    await deleteBanner(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchList()
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
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

/* 触发区撑满整个上传框，点击框内任意位置都能打开文件选择 */
.avatar-uploader :deep(.el-upload__trigger) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-preview {
  width: 200px;
  height: 100px;
}
</style>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>课程管理</h2>
      <el-button type="primary" @click="handleAdd">新增课程</el-button>
    </div>

    <div class="filter-bar">
      <el-select
        v-model="filterCategory"
        placeholder="全部分类"
        clearable
        @change="fetchList"
        style="width: 200px"
      >
        <el-option
          v-for="cat in categoryList"
          :key="cat.id"
          :label="cat.name"
          :value="cat.id"
        />
      </el-select>
    </div>

    <el-table :data="courseList" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="封面" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.cover"
            :src="row.cover"
            style="width: 100px; height: 60px"
            fit="cover"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" show-overflow-tooltip />
      <el-table-column prop="category_name" label="分类" width="120" />
      <el-table-column prop="level_name" label="所需等级" width="120" />
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'">
            {{ formatStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            size="small"
            :type="row.status === 'published' ? 'info' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'published' ? '下架' : '上架' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑课程' : '新增课程'"
      width="800px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入课程标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in categoryList"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="handleUpload"
            accept="image/*"
          >
            <el-image
              v-if="form.cover"
              :src="form.cover"
              class="upload-preview"
              fit="cover"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="项目介绍">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="6"
            placeholder="请输入课程介绍，支持 HTML"
          />
        </el-form-item>
        <el-form-item label="课程目录">
          <el-input
            v-model="form.catalog"
            type="textarea"
            :rows="5"
            placeholder="每行一个章节"
          />
        </el-form-item>
        <el-form-item label="网盘资源">
          <el-input
            v-model="form.netdisk_resource"
            type="textarea"
            :rows="6"
            placeholder="请输入完整的网盘资源文本，例如：&#10;链接：https://pan.baidu.com/s/xxxxx?pwd=6pg1&#10;提取码：6pg1&#10;复制这段内容后打开百度网盘手机App，操作更方便哦"
          />
        </el-form-item>
        <el-form-item label="所需等级">
          <el-select v-model="form.level_required" placeholder="请选择所需等级" style="width: 100%" clearable>
            <el-option
              v-for="level in levelList"
              :key="level.id"
              :label="level.name"
              :value="level.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="published">已发布</el-radio>
            <el-radio label="unlisted">隐藏</el-radio>
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
  getCourseList,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseStatus
} from '@/api/course'
import { getCategoryList } from '@/api/category'
import { getLevelList } from '@/api/level'
import { uploadImage } from '@/api/upload'

const courseList = ref([])
const categoryList = ref([])
const levelList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const filterCategory = ref('')

const form = reactive({
  title: '',
  cover: '',
  category_id: '',
  description: '',
  catalog: '',
  netdisk_resource: '',
  level_required: '',
  sort_order: 0,
  status: 'published'
})

const resetForm = () => {
  form.title = ''
  form.cover = ''
  form.category_id = ''
  form.description = ''
  form.catalog = ''
  form.netdisk_resource = ''
  form.level_required = ''
  form.sort_order = 0
  form.status = 'published'
}

const fetchList = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterCategory.value) {
      params.category_id = filterCategory.value
    }
    const res = await getCourseList(params)
    courseList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取课程列表失败')
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await getCategoryList()
    categoryList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

const fetchLevels = async () => {
  try {
    const res = await getLevelList()
    levelList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取等级列表失败')
  }
}

const formatStatus = (status) => {
  const map = {
    published: '已发布',
    unlisted: '隐藏',
    disabled: '下架'
  }
  return map[status] || status
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
  form.title = row.title
  form.cover = row.cover || ''
  form.category_id = row.category_id || ''
  form.description = row.description || ''
  form.catalog = row.catalog || ''
  form.netdisk_resource = row.netdisk_resource || ''
  form.level_required = row.level_required || ''
  form.sort_order = row.sort_order
  form.status = row.status
  dialogVisible.value = true
}

const handleUpload = async ({ file }) => {
  try {
    const res = await uploadImage(file)
    form.cover = res.data.data.url
    ElMessage.success('上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

const handleSubmit = async () => {
  if (!form.title) {
    ElMessage.warning('请输入课程标题')
    return
  }
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateCourse(currentId.value, form)
    } else {
      await createCourse(form)
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
    const newStatus = row.status === 'published' ? 'disabled' : 'published'
    await updateCourseStatus(row.id, { status: newStatus })
    ElMessage.success('操作成功')
    fetchList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该课程吗？', '提示', {
      type: 'warning'
    })
    await deleteCourse(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchCategories()
  fetchLevels()
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

.filter-bar {
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
  height: 120px;
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
  width: 200px;
  height: 120px;
}
</style>

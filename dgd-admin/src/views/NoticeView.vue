<template>
  <div class="page-container">
    <div class="page-header">
      <h2>通知管理</h2>
      <el-button type="primary" @click="handleAdd">新增通知</el-button>
    </div>

    <el-table :data="noticeList" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
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
      :title="isEdit ? '编辑通知' : '新增通知'"
      width="600px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="3"
            placeholder="请输入通知内容"
          />
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
  getNoticeList,
  createNotice,
  updateNotice,
  deleteNotice,
  updateNoticeStatus
} from '@/api/notice'

const noticeList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const form = reactive({
  content: '',
  sort_order: 0,
  status: 'active'
})

const resetForm = () => {
  form.content = ''
  form.sort_order = 0
  form.status = 'active'
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getNoticeList()
    noticeList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取通知列表失败')
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
  form.content = row.content
  form.sort_order = row.sort_order
  form.status = row.status
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!form.content) {
    ElMessage.warning('请输入通知内容')
    return
  }
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateNotice(currentId.value, form)
    } else {
      await createNotice(form)
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
    await updateNoticeStatus(row.id, { status: newStatus })
    ElMessage.success('操作成功')
    fetchList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该通知吗？', '提示', {
      type: 'warning'
    })
    await deleteNotice(row.id)
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
</style>

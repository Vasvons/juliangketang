<template>
  <div class="page-container">
    <div class="page-header">
      <h2>卡密管理</h2>
      <el-button type="primary" @click="handleGenerate">批量生成卡密</el-button>
    </div>

    <div class="filter-bar">
      <el-select
        v-model="filterStatus"
        placeholder="全部状态"
        clearable
        @change="fetchList"
        style="width: 160px"
      >
        <el-option label="未使用" value="pending" />
        <el-option label="已使用" value="used" />
      </el-select>
    </div>

    <el-table :data="codeList" v-loading="loading" border>
      <el-table-column prop="code" label="卡密" width="220" />
      <el-table-column prop="level_name" label="等级" width="120" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'used' ? 'info' : 'success'">
            {{ row.status === 'used' ? '已使用' : '未使用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="used_by_nickname" label="使用者" width="120" />
      <el-table-column prop="used_at" label="使用时间" width="180" />
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      title="批量生成卡密"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="选择等级">
          <el-select v-model="form.level_id" placeholder="请选择等级" style="width: 100%">
            <el-option
              v-for="level in levelList"
              :key="level.id"
              :label="level.name"
              :value="level.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input-number v-model="form.count" :min="1" :max="1000" style="width: 100%" />
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
  getActivationCodeList,
  generateActivationCodes,
  deleteActivationCode
} from '@/api/activation'
import { getLevelList } from '@/api/level'

const codeList = ref([])
const levelList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const filterStatus = ref('')

const form = reactive({
  level_id: '',
  count: 10
})

const fetchList = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    const res = await getActivationCodeList(params)
    codeList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取卡密列表失败')
  } finally {
    loading.value = false
  }
}

const fetchLevels = async () => {
  try {
    const res = await getLevelList()
    levelList.value = res.data || []
    if (levelList.value.length > 0 && !form.level_id) {
      form.level_id = levelList.value[0].id
    }
  } catch (error) {
    ElMessage.error('获取等级列表失败')
  }
}

const handleGenerate = () => {
  form.level_id = levelList.value[0]?.id || ''
  form.count = 10
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!form.level_id) {
    ElMessage.warning('请选择等级')
    return
  }
  submitting.value = true
  try {
    await generateActivationCodes(form)
    ElMessage.success('生成成功')
    dialogVisible.value = false
    fetchList()
  } catch (error) {
    ElMessage.error('生成失败')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该卡密吗？', '提示', {
      type: 'warning'
    })
    await deleteActivationCode(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
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
</style>

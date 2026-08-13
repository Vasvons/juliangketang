<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="keyword"
        placeholder="按昵称 / openid 搜索"
        clearable
        @change="fetchList"
        style="width: 280px"
      />
    </div>

    <el-table :data="filteredList" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="头像" width="80">
        <template #default="{ row }">
          <el-image
            v-if="row.avatar"
            :src="row.avatar"
            style="width: 40px; height: 40px; border-radius: 50%"
            fit="cover"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
      <el-table-column prop="openid" label="OpenID" show-overflow-tooltip />
      <el-table-column label="当前等级" width="140">
        <template #default="{ row }">
          <el-tag :type="row.level_id > 1 ? 'warning' : 'info'">
            {{ row.level_name || '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="180" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEditLevel(row)">改等级</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="修改用户等级" width="440px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户">
          <span>{{ currentUser.nickname || currentUser.openid || '-' }}</span>
        </el-form-item>
        <el-form-item label="当前等级">
          <span>{{ currentUser.level_name || '普通用户' }}</span>
        </el-form-item>
        <el-form-item label="新等级">
          <el-select v-model="form.level_id" placeholder="请选择等级" style="width: 100%">
            <el-option
              v-for="level in levelList"
              :key="level.id"
              :label="level.name"
              :value="level.id"
            />
          </el-select>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserList, updateUserLevel } from '@/api/user'
import { getLevelList } from '@/api/level'

const userList = ref([])
const levelList = ref([])
const loading = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const submitting = ref(false)
const currentUser = ref({})

const form = reactive({
  level_id: ''
})

const filteredList = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return userList.value
  return userList.value.filter((u) => {
    return (
      (u.nickname && u.nickname.toLowerCase().includes(kw)) ||
      (u.openid && u.openid.toLowerCase().includes(kw))
    )
  })
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getUserList()
    userList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
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

const handleEditLevel = (row) => {
  currentUser.value = row
  form.level_id = row.level_id || 1
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!form.level_id) {
    ElMessage.warning('请选择等级')
    return
  }
  submitting.value = true
  try {
    await updateUserLevel(currentUser.value.id, { level_id: form.level_id })
    ElMessage.success('修改成功')
    dialogVisible.value = false
    fetchList()
  } catch (error) {
    ElMessage.error('修改失败')
  } finally {
    submitting.value = false
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

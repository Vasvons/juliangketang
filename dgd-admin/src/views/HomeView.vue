<template>
  <div class="home-page">
    <h2>后台首页</h2>
    <p class="welcome-text">欢迎使用 JLDJT 管理后台</p>
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-value">{{ stats.userCount }}</div>
          <div class="stat-label">用户总数</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-value">{{ stats.courseCount }}</div>
          <div class="stat-label">课程总数</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-value">{{ stats.categoryCount }}</div>
          <div class="stat-label">分类总数</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-value">{{ stats.usedCodeCount }}</div>
          <div class="stat-label">已使用卡密数</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-value">{{ stats.unusedCodeCount }}</div>
          <div class="stat-label">未使用卡密数</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDashboardStats } from '@/api/dashboard'

const stats = reactive({
  userCount: 0,
  courseCount: 0,
  categoryCount: 0,
  codeCount: 0,
  usedCodeCount: 0,
  unusedCodeCount: 0
})

const fetchStats = async () => {
  try {
    const res = await getDashboardStats()
    Object.assign(stats, res.data)
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.home-page {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.welcome-text {
  color: #666;
  margin-bottom: 20px;
}

.stats-row {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
  margin-bottom: 20px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}
</style>

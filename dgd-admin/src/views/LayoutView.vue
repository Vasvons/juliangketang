<template>
  <el-container class="layout-container">
    <el-aside :width="appStore.sidebarCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo">
        <span v-if="!appStore.sidebarCollapsed">JYLXT Admin</span>
        <el-icon v-else><Management /></el-icon>
      </div>
      <el-menu
        :default-active="currentPath"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item
          v-for="item in menuList"
          :key="item.path"
          :index="`/dashboard/${item.path}`"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="appStore.toggleSidebar">
            <Fold v-if="!appStore.sidebarCollapsed" />
            <Expand v-else />
          </el-icon>
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              {{ userStore.userInfo?.username || '管理员' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()
const userStore = useUserStore()

// 直接从 window.location 读取路径，避免 useRoute() 在生产构建中返回 undefined
const currentPath = ref(window.location.pathname)

const menuList = [
  { path: 'home', title: '后台首页', icon: 'HomeFilled' },
  { path: 'banner', title: 'Banner 管理', icon: 'PictureFilled' },
  { path: 'notice', title: '通知管理', icon: 'BellFilled' },
  { path: 'category', title: '分类管理', icon: 'FolderOpened' },
  { path: 'course', title: '课程管理', icon: 'Reading' },
  { path: 'level', title: '等级管理', icon: 'Medal' },
  { path: 'user', title: '用户管理', icon: 'User' },
  { path: 'activation-code', title: '卡密管理', icon: 'Key' },
  { path: 'config', title: '页面配置', icon: 'SetUp' }
]

const pageTitle = computed(() => {
  const matched = menuList.find((item) => currentPath.value === `/dashboard/${item.path}`)
  return matched?.title || '管理后台'
})

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    // 使用 window.location 跳转，避免 router 实例在某些情况下为 undefined
    window.location.href = (import.meta.env.BASE_URL || '/') + 'login'
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f2d3d;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 16px;
}

.page-title {
  font-size: 16px;
  font-weight: 500;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.main {
  background-color: #f5f7fa;
}
</style>

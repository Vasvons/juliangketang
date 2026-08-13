import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/LayoutView.vue'),
    redirect: '/dashboard/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '后台首页', icon: 'HomeFilled' }
      },
      {
        path: 'banner',
        name: 'Banner',
        component: () => import('@/views/BannerView.vue'),
        meta: { title: 'Banner 管理', icon: 'PictureFilled' }
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/NoticeView.vue'),
        meta: { title: '通知管理', icon: 'BellFilled' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/CategoryView.vue'),
        meta: { title: '分类管理', icon: 'FolderOpened' }
      },
      {
        path: 'course',
        name: 'Course',
        component: () => import('@/views/CourseView.vue'),
        meta: { title: '课程管理', icon: 'Reading' }
      },
      {
        path: 'level',
        name: 'Level',
        component: () => import('@/views/LevelView.vue'),
        meta: { title: '等级管理', icon: 'Medal' }
      },
      {
        path: 'activation-code',
        name: 'ActivationCode',
        component: () => import('@/views/ActivationCodeView.vue'),
        meta: { title: '卡密管理', icon: 'Key' }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/ConfigView.vue'),
        meta: { title: '页面配置', icon: 'SetUp' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router

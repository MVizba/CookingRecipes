import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { authenticate } from './guards'
import HomeLayout from '@/layouts/HomeLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'category/create',
          name: 'CategoryCreate',
          component: () => import('../views/CategoryCreateView.vue'),
        },
        {
          path: 'category/:id',
          name: 'CategoryView',
          component: () => import('../views/CategoryView.vue'),
        },
        {
          path: 'category/:id/recipe/create',
          name: 'RecipeCreate',
          component: () => import('../views/RecipeCreateView.vue'),
        },
        {
          path: 'recipe/:id',
          name: 'RecipeView',
          component: () => import('../views/RecipeView.vue'),
        },
        {
          path: 'recipe/:id/product/create',
          name: 'ProductCreate',
          component: () => import('../views/ProductCreateView.vue'),
        },
        {
          path: 'recipe/:recipeId/product/create',
          name: 'ProductCreate',
          component: () => import('../views/ProductCreateView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
      ],
    },
  ],
})

export default router

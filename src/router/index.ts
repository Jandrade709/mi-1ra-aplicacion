import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import BaseLayout from '@/layouts/BaseLayout.vue';
import { useUserStore } from '@/stores/user';

const Login = () => import('@/views/LoginPage.vue');
const Registro = () => import('@/views/RegistroPage.vue');
const Camera = () => import('@/views/Camera.vue');
const SeccionContenidos = () => import('@/views/SeccionContenidos.vue');

function getAuthenticatedHomePath() {
  const userStore = useUserStore();
  return userStore.token ? (localStorage.getItem('home') ? JSON.parse(localStorage.getItem('home') as string)?.url : null) : null;
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: () => getAuthenticatedHomePath() ? `/${getAuthenticatedHomePath()}` : '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    },
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro,
    meta: {
      requiresAuth: false
    },
  },
  {
    path: '/camera',
    name: 'Camera',
    component: Camera,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/seccion',
    name: 'Seccion',
    component: BaseLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        redirect: () => getAuthenticatedHomePath() ? `/${getAuthenticatedHomePath()}` : '/login'
      },
      {
        path: ':name',
        name: 'SeccionContenidos',
        component: SeccionContenidos,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.token;
  const isGuestOnlyRoute = to.name === 'Login' || to.name === 'Registro';
  const homePath = getAuthenticatedHomePath();

  if(to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  }else if(isAuthenticated && isGuestOnlyRoute) {
    next(homePath ? `/${homePath}` : '/seccion');
  } else {
    next();
  }
});

export default router

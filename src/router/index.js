import { createRouter, createWebHistory } from '@ionic/vue-router';
import { store } from '../store/store.js'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Calories from '../views/Calories.vue'
import Weight from '../views/Weight.vue'
import Workouts from '../views/Workouts.vue'
import Profile from '../views/Profile.vue'
import Setup from '../views/Setup.vue'

const routes = [
  {
    path: '/',
    redirect: '/tabs/calories'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/forgotPassword',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: "/tabs/",
    component: Home,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "",
        redirect: "calories",
      },
      {
        path: "calories",
        name: "Calories",
        component: Calories,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "weight",
        name: "Weight",
        component: Weight,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "workouts",
        name: "Workouts",
        component: Workouts,
        meta: {
          requiresAuth: true
        }
      },
    ],
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup,
    meta: {
      requiresAuth: true
    },
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {

    if (to.name == "Setup") {
      next()
      return
    }

    store.dispatch("valid").then(() => {
        if (store.getters.isLoggedIn) {

          if (store.getters.isSetup) {
            next()
          } else {
            next('/setup')
          }
          
          return
        }
        next('/login')
      }
    )
  } else {
    if (store.getters.isLoggedIn) {
      next('/')
      return
    }
    next()
  }
})

export default router

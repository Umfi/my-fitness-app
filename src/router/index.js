import { createRouter, createWebHistory } from '@ionic/vue-router';
import { isLoggedIn, isSetup } from "../service/AuthService.js";


import Home from '../views/tabs/Home.vue'
import Login from '../views/Unauthenticated/Login.vue'
import Register from '../views/Unauthenticated/Register.vue'
import ForgotPassword from '../views/Unauthenticated/ForgotPassword.vue'
import Calories from '../views/tabs/Calories/Calories.vue'
import Overview from '../views/tabs/Overview/Overview.vue'
import Workouts from '../views/tabs/Workouts/Workouts.vue'
import Profile from '../views/User/Profile.vue'
import Setup from '../views/User/Setup.vue'

const routes = [
  {
    path: '/',
    redirect: '/tabs/overview'
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
        redirect: "overview",
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
        path: "overview",
        name: "Overview",
        component: Overview,
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

    isLoggedIn().then(res => {
      if (res) {
        isSetup().then(set => {
          if (set) {
            next()
          } else {
            next('/setup')
          }
        })
      } else {
        next('/login')
      }
    })

  } else {

    isLoggedIn().then(res => {
      if (res) {
        next('/')
      } else {
        next()
      }
    })
    
  }
})

export default router

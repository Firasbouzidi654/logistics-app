import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/abc-xyz',      name: 'ABCXYZ',      component: () => import('../views/ABCXYZView.vue')      },
  { path: '/stueckliste',  name: 'Stueckliste',  component: () => import('../views/StuecklisteView.vue') },
  { path: '/make-or-buy',  name: 'MakeOrBuy',   component: () => import('../views/MakeOrBuyView.vue')   },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

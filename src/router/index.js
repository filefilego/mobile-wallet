import { createRouter, createWebHistory } from '@ionic/vue-router';
import CreateKey from '../views/CreateKey.vue'
import Home from '../views/Home.vue'
import Unlock from '../views/Unlock.vue'
import Settings from '../views/Settings.vue'
import { globalState, unlockKey } from '../store';
import { GetKeyFromStorage, GetUnlockedKeyFromStorage } from "../key.js"

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/create_key',
    name: 'CreateKey',
    component: CreateKey
  },
  {
    path: '/unlock',
    name: 'Unlock',
    component: Unlock
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async(to, from, next) => {
  let keyStr = await GetKeyFromStorage()
  if(!keyStr) {
    if(to.name == "CreateKey") next(); else next({ name: 'CreateKey' });
  } else {
    let isAuthenticated = false;
    let unlockedKey = await GetUnlockedKeyFromStorage()
    if(unlockedKey) {
      unlockKey(JSON.parse(unlockedKey))
    }
      // if already authenticated.
    if(globalState.address != "") {
      let now = Math.floor(Date.now() / 1000);
      if(now - globalState.unlockedTime > 60 * 60 * 24) {
        isAuthenticated = false;
      } else {
        isAuthenticated = true;
      }
    }

    if(!isAuthenticated && to.name != "Unlock") {
      next({ name: 'Unlock' })
    } else {
      next()
    }
  }

})

export default router

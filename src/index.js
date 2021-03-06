import Vue from 'vue'
import Router from 'vue-router'
import I18n from 'plato-i18n'
import Validator from 'plato-validator'
import App from 'app'
import { routes, alias } from 'routes'
import store from 'vx/store'
import { env } from 'vx/getters'

if (module.hot) {
  module.hot.accept()
}

Vue.config.debug = __DEV__

// global mixins
Vue.mixin({
  vuex: {
    getters: {
      env
    }
  }
})

// 国际化，如果未使用，请移除
Vue.use(I18n, {
  // 翻译资源库
  data () {
    return env(store.state).i18n
  }
})

// (表单)验证，如果未使用，请移除
Vue.use(Validator)

Vue.use(Router)

const router = new Router({
  history: false,
  saveScrollPosition: true,
  linkActiveClass: 'link-active'
})

// register routes
router.map(routes)
router.alias(alias)

router.beforeEach(transition => {
  if (transition.to.auth && !env(store.state).authorized) {
    transition.abort()
  } else {
    transition.next()
  }
})

router.afterEach(transition => {
  window.scrollTo(0, 0)
})

router.start(App, 'app')

import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// import './static/iconfont/iconfont.js'

const app = new Vue({
    ...App
})
app.$mount()

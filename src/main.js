import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import API from './controllers/api'

Vue.config.productionTip = false

const api = new API()

Object.assign(api, {
	install() {
		Vue.prototype.$api = this
	}
})

Vue.use(api)

new Vue({
	router,
	store,
	api,
	render: h => h(App)
}).$mount('#app')

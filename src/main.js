import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import User from './controllers/user'

Vue.config.productionTip = false

const user = new User()

Object.assign(user, {
	install() {
		Vue.prototype.$user = this
	}
})

Vue.use(user)

new Vue({
	router,
	store,
	user,
	render: h => h(App),
	computed: {
		$app() {
			return this.$children[0]
		},
		url() {
			const { origin, pathname = '' } = window.location

			return origin.concat(pathname, '#')
		}
	}
}).$mount('#app')

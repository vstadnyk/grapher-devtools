import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import apolloProvider from './apollo'

import Server from './controllers/server'

const {
	url,
	config: {
		ping: { intervals }
	}
} = Server

Vue.config.productionTip = false

const ping = () =>
	fetch(url)
		.then(() => {
			store.commit('isOnline', true)
		})
		.catch(error => {
			console.error('Ping server error', error)

			store.commit('isOnline', null)
		})

ping()

setInterval(() => {
	ping()
}, intervals.server)

new Vue({
	router,
	store,
	apolloProvider,
	render: h => h(App)
}).$mount('#app')

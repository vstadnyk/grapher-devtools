import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'

Vue.use(Router)

const load = view => () => import(/* webpackChunkName: "[request]" */ `./pages/${view}.vue`)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	linkActiveClass: 'active',
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/test',
			name: 'Test',
			component: load('Test')
		}
	]
})

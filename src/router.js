import Vue from 'vue'
import Router from 'vue-router'
import Server from './pages/Server.vue'

Vue.use(Router)

const load = view => () => import(/* webpackChunkName: "[request]" */ `./pages/${view}.vue`)

export default new Router({
	mode: 'hash', // 'history',
	base: process.env.BASE_URL,
	linkExactActiveClass: 'active',
	routes: [
		{
			path: '/',
			name: 'Server',
			meta: {
				title: 'Server'
			},
			component: Server
		},
		{
			path: '/error-logs',
			name: 'Error logs',
			component: load('Logs'),
			props: {
				type: 'errors',
				fields: [
					{
						key: 'errorType',
						alias: 'type',
						input: true
					},
					{
						key: 'date'
					},
					{
						key: 'apptype',
						select: {
							options: ['all', 'admin', 'web', 'mobile']
						}
					},
					{
						key: 'appplatform',
						select: {
							options: ['all', 'web', 'ios', 'android']
						}
					},
					{
						key: 'operationName',
						input: true
					}
				]
			}
		},
		{
			path: '/query-logs',
			name: 'Query logs',
			component: load('Logs'),
			props: {
				type: 'queries',
				fields: [
					{
						key: 'date'
					},
					{
						key: 'apptype',
						select: {
							options: ['all', 'admin', 'web', 'mobile']
						}
					},
					{
						key: 'appplatform',
						select: {
							options: ['all', 'web', 'ios', 'android']
						}
					},
					{
						key: 'operationName',
						input: true
					}
				]
			}
		},
		{
			path: '/jwt',
			name: 'JWT',
			meta: {
				title: 'JWT Authorization'
			},
			component: load('AuthJWT')
		},
		{
			path: '/ssl',
			name: 'SSL',
			component: load('SSL')
		}
	]
})

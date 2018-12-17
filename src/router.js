import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const load = view => () => import(/* webpackChunkName: "[request]" */ `./pages/${view}.vue`)

export default new Router({
	mode: 'hash',
	base: process.env.BASE_URL,
	linkExactActiveClass: 'current',
	linkActiveClass: 'active',
	routes: [
		{
			path: '/',
			component: load('index')
		},
		{
			path: '/404',
			meta: {
				title: 'Not found'
			},
			component: load('404')
		},
		{
			path: '*',
			redirect: '/404'
		},
		{
			path: '/server/',
			menu: 'Server',
			meta: {
				title: 'Server'
			},
			component: load('server/index'),
			children: [
				{
					path: '',
					meta: {
						title: 'General'
					},
					component: load('server/Info')
				},
				{
					path: '/server/ssl',
					menu: 'SSL',
					meta: {
						title: 'SSL Sertificates'
					},
					component: load('server/SSL')
				},
				{
					path: '/server/logs',
					menu: 'Logs',
					meta: {
						title: 'Logs'
					},
					component: load('server/logs/index'),
					children: [
						{
							path: '/server/logs/errors',
							menu: 'Errors',
							exact: true,
							meta: {
								title: 'Errors'
							},
							component: load('server/logs/Errors'),
							children: [
								{
									path: 'view/:date',
									meta: {
										title: 'View error log row'
									},
									component: load('server/logs/view'),
									props: {
										type: 'errors'
									}
								}
							]
						},

						{
							path: '/server/logs/queries',
							menu: 'Queries',
							meta: {
								title: 'Queries'
							},
							component: load('server/logs/Queries'),
							children: [
								{
									path: 'view/:date',
									meta: {
										title: 'View query log row'
									},
									component: load('server/logs/view'),
									props: {
										type: 'queries'
									}
								}
							]
						}
					]
				}
			]
		},
		{
			path: '/notifications',
			menu: 'Notifications',
			meta: {
				title: 'Notifications'
			},
			component: load('notifications/index'),
			children: [
				{
					path: '',
					meta: {
						title: 'General'
					},
					component: load('notifications/Info')
				},
				{
					path: '/notifications/subscribers/',
					menu: 'Subscribers',
					meta: {
						title: 'Subscribers'
					},
					component: load('notifications/subscribers/index'),
					children: [
						{
							path: '',
							component: load('notifications/subscribers/list')
						},
						{
							path: 'view/:id',
							meta: {
								title: 'View subscriber'
							},
							component: load('notifications/subscribers/view')
						}
					]
				},
				{
					path: '/notifications/templates/',
					menu: 'Templates',
					meta: {
						title: 'Templates'
					},
					component: load('notifications/templates/index'),
					children: [
						{
							path: '',
							component: load('notifications/templates/list')
						},
						{
							path: 'new',
							meta: {
								title: 'New template'
							},
							component: load('notifications/templates/form')
						},
						{
							path: 'edit/:id',
							meta: {
								title: 'Edit template'
							},
							component: load('notifications/templates/form')
						},
						{
							path: 'view/:id',
							meta: {
								title: 'View template'
							},
							component: load('notifications/templates/view')
						}
					]
				}
			]
		}
	]
})

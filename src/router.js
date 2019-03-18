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
			meta: {
				title: 'Home screen',
				permission: ['dt-home', 'dt-login']
			},
			component: load('index')
		},
		{
			path: '/404',
			name: '404',
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
			component: load('server/index'),
			children: [
				{
					path: '',
					meta: {
						title: 'Server',
						permission: 'server-show-info'
					},
					component: load('server/Info')
				},
				{
					path: '/server/ssl',
					menu: 'SSL',
					meta: {
						title: 'SSL Sertificates',
						permission: 'server-edit-ssl'
					},
					component: load('server/SSL')
				},
				{
					path: '/server/logs',
					menu: 'Logs',
					component: load('server/logs/index'),
					children: [
						{
							path: '',
							meta: {
								title: 'Logs',
								permission: 'server-show-log'
							},
							component: load('server/logs/info')
						},
						{
							path: '/server/logs/errors',
							menu: 'Errors',
							meta: {
								title: 'Errors',
								permission: 'server-show-log'
							},
							component: load('server/logs/errors'),
							children: [
								{
									path: 'view/:id',
									name: 'viewErrorLog',
									meta: {
										title: 'View error log row',
										permission: 'server-show-log'
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
								title: 'Queries',
								permission: 'server-show-log'
							},
							component: load('server/logs/queries'),
							children: [
								{
									path: 'view/:id',
									name: 'viewQueryLog',
									meta: {
										title: 'View query log row',
										permission: 'server-show-log'
									},
									component: load('server/logs/view'),
									props: {
										type: 'queries'
									}
								}
							]
						},
						{
							path: '/server/logs/config',
							menu: 'Config',
							meta: {
								title: 'Loger config',
								permission: 'dt-show-log-config'
							},
							component: load('server/logs/config')
						}
					]
				},
				{
					path: '/server/config',
					menu: 'Config',
					component: load('server/config/index'),
					children: [
						{
							path: '',
							meta: {
								title: 'Config',
								permission: 'config-show'
							},
							component: load('server/config/list')
						},
						{
							path: 'view/:id',
							name: 'viewConfig',
							meta: {
								title: 'View config',
								permission: 'config-show'
							},
							component: load('server/config/view')
						},
						{
							path: 'new',
							name: 'newConfig',
							meta: {
								title: 'New config',
								permission: 'config-add'
							},
							component: load('server/config/form/index')
						},
						{
							path: 'edit/:id',
							name: 'editConfig',
							meta: {
								title: 'Edit config',
								permission: 'config-edit'
							},
							component: load('server/config/form/index')
						}
					]
				},
				{
					path: '/server/lexicons',
					menu: 'Lexicons',
					component: load('server/lexicons/index'),
					children: [
						{
							path: '',
							meta: {
								title: 'Lexicons',
								permission: 'locale-show'
							},
							component: load('server/lexicons/list')
						},
						{
							path: 'view/:id',
							name: 'viewLexicon',
							meta: {
								title: 'View lexicon',
								permission: 'locale-show'
							},
							component: load('server/lexicons/form')
						},
						{
							path: 'edit/:id',
							name: 'editLexicon',
							meta: {
								title: 'Edit lexicon',
								permission: 'locale-edit'
							},
							component: load('server/lexicons/form'),
							props: {
								editable: true
							}
						}
					]
				}
			]
		},
		/* {
			path: '/content',
			menu: 'Content',
			component: load('content/index'),
			children: [
				{
					path: '',
					meta: {
						title: 'Content',
						permission: 'contents-show'
					},
					component: load('content/list')
				},
				{
					path: 'view/:id',
					name: 'viewContent',
					meta: {
						title: 'View content',
						permission: 'contents-show'
					},
					component: load('content/view')
				},
				{
					path: 'new',
					name: 'newContent',
					meta: {
						title: 'New content',
						permission: 'contents-add'
					},
					component: load('content/form')
				},
				{
					path: 'edit/:id',
					name: 'editContent',
					meta: {
						title: 'Edit content',
						permission: 'contents-edit'
					},
					component: load('content/form')
				}
			]
		}, */
		{
			path: '/notifications',
			menu: 'Notifications',
			component: load('notifications/index'),
			children: [
				{
					path: '',
					meta: {
						title: 'Notifications',
						permission: ['push-templates-show']
					},
					component: load('notifications/Info')
				},
				{
					path: '/notifications/send',
					name: 'sendNotification',
					menu: 'Send',
					meta: {
						title: 'Send  notification',
						permission: [
							'push-templates-show',
							'push-subscribers-show',
							'push-subscribers-send'
						]
					},
					component: load('notifications/send')
				},
				{
					path: '/notifications/subscribers/',
					menu: 'Subscribers',
					component: load('notifications/subscribers/index'),
					children: [
						{
							path: '',
							meta: {
								title: 'Subscribers',
								permission: ['push-subscribers-show', 'push-subscribers-show-data']
							},
							component: load('notifications/subscribers/list')
						},
						{
							path: 'view/:id',
							name: 'viewSubscriber',
							meta: {
								title: 'View subscriber',
								permission: 'push-subscribers-show'
							},
							component: load('notifications/subscribers/view')
						},
						{
							path: 'new',
							name: 'addSubscriber',
							meta: {
								title: 'Add subscriber',
								permission: 'push-subscribers-subscribe'
							},
							component: load('notifications/subscribers/form')
						}
					]
				},
				{
					path: '/notifications/templates/',
					menu: 'Templates',
					component: load('notifications/templates/index'),
					children: [
						{
							path: '',
							meta: {
								title: 'Templates',
								permission: 'push-templates-show'
							},
							component: load('notifications/templates/list')
						},
						{
							path: 'new',
							name: 'newNotificationTemplate',
							meta: {
								title: 'New template',
								permission: 'push-templates-add'
							},
							component: load('notifications/templates/form')
						},
						{
							path: 'edit/:id',
							name: 'editNotificationTemplate',
							meta: {
								title: 'Edit template',
								permission: 'push-templates-edit'
							},
							component: load('notifications/templates/form')
						},
						{
							path: 'view/:id',
							name: 'viewNotificationTemplate',
							meta: {
								title: 'View template',
								permission: 'push-templates-show'
							},
							component: load('notifications/templates/view')
						}
					]
				},
				{
					path: '/notifications/config',
					menu: 'Config',
					meta: {
						title: 'Notifications config',
						permission: 'push-templates-show'
					},
					component: load('notifications/config')
				}
			]
		},
		{
			path: '/emails',
			menu: 'Emails',
			component: load('emails/index'),
			children: [
				{
					path: '',
					meta: {
						title: 'Emails',
						permission: 'mail-templates-show'
					},
					component: load('emails/info')
				},
				/* {
					path: '/emails/send',
					name: 'sendMail',
					menu: 'Send',
					meta: {
						title: 'Send email',
						permission: ['mail-send', 'mail-templates-show']
					},
					component: load('emails/send')
				}, */
				{
					path: '/emails/templates/',
					menu: 'Templates',
					component: load('emails/templates/index'),
					children: [
						{
							path: '',
							meta: {
								title: 'Templates',
								permission: 'mail-templates-show'
							},
							component: load('emails/templates/list')
						},
						{
							path: 'new',
							name: 'newMailTemplate',
							meta: {
								title: 'New template',
								permission: 'mail-templates-add'
							},
							component: load('emails/templates/form')
						},
						{
							path: 'edit/:id',
							name: 'editMailTemplate',
							meta: {
								title: 'Edit template',
								permission: 'mail-templates-edit'
							},
							component: load('emails/templates/form')
						},
						{
							path: 'view/:id',
							name: 'viewMailTemplate',
							meta: {
								title: 'View template',
								permission: 'mail-templates-show'
							},
							component: load('emails/templates/view')
						}
					]
				}
			]
		},
		{
			path: '/locations',
			menu: 'Locations',
			component: load('locations/index'),
			children: [
				{
					path: '',
					meta: {
						title: 'Locations',
						permission: 'locations-show'
					},
					component: load('locations/list')
				},
				{
					path: '/locations/map/',
					name: 'worldMap',
					menu: 'Map',
					meta: {
						title: 'World map',
						permission: 'dt-locations-show-map'
					},
					component: load('locations/map')
				},
				{
					path: 'new',
					name: 'newLocation',
					meta: {
						title: 'New location',
						permission: 'locations-add'
					},
					component: load('locations/form/index')
				},
				{
					path: 'edit/:id',
					name: 'editLocation',
					meta: {
						title: 'Edit location',
						permission: 'locations-edit'
					},
					component: load('locations/form/index')
				},
				{
					path: 'view/:id',
					name: 'viewLocation',
					meta: {
						title: 'View location',
						permission: 'locations-show'
					},
					component: load('locations/view')
				}
			]
		},
		{
			path: '/users',
			menu: 'Users',
			component: load('users/index'),
			children: [
				{
					path: '',
					meta: {
						title: 'Users',
						permission: 'users-show'
					},
					component: load('users/list')
				},
				/* {
					path: '/users/jwt',
					menu: 'JWT',
					meta: {
						title: 'JWT',
						permission: 'server-test-token'
					},
					component: load('users/jwt')
				}, */
				{
					path: 'new',
					name: 'newUser',
					meta: {
						title: 'New user',
						permission: 'users-add'
					},
					component: load('users/form/index')
				},
				{
					path: 'edit/:id',
					name: 'editUser',
					meta: {
						title: 'Edit user',
						permission: 'users-edit'
					},
					component: load('users/form/index')
				},
				{
					name: 'viewUser',
					path: 'view/:id',
					meta: {
						title: 'View user',
						permission: 'users-show'
					},
					component: load('users/view')
				},
				{
					name: 'disableUser',
					path: 'disable/:id',
					meta: {
						title: 'Disable user account',
						permission: 'users-edit-status'
					},
					component: load('users/sender/index'),
					props: {
						tmpl: 'disable_user',
						active: false
					}
				},
				{
					name: 'enableUser',
					path: 'enable/:id',
					meta: {
						title: 'Enable user account',
						permission: 'users-edit-status'
					},
					component: load('users/sender/index'),
					props: {
						tmpl: 'enable_user',
						active: true
					}
				},
				{
					path: '/users/permissions/',
					menu: 'Permissions',
					component: load('users/permissions/index'),
					children: [
						{
							path: '',
							meta: {
								title: 'User permissions',
								permission: [
									'user-permissions-show',
									'user-permissions-show-config'
								]
							},
							component: load('users/permissions/list')
						},
						{
							path: 'new',
							name: 'newUserPermission',
							meta: {
								title: 'New permission',
								permission: 'user-permissions-add'
							},
							component: load('users/permissions/form/index')
						},
						{
							path: 'edit/:id',
							name: 'editUserPermission',
							meta: {
								title: 'Edit permission',
								permission: 'user-permissions-edit'
							},
							component: load('users/permissions/form/index')
						},
						{
							path: 'view/:id',
							name: 'viewUserPermission',
							meta: {
								title: 'View permission',
								permission: 'user-permissions-show'
							},
							component: load('users/permissions/view')
						}
					]
				}
			]
		}
	]
})

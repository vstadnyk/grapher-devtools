<template>
	<Table v-bind="table" :data-hook="join" />
</template>

<script>
import api from '../../../controllers/api'
import Table from '../../../components/Table/index.vue'

import {
	PushSubscribers as query,
	RemoveSubscribersByID,
	PushSubscriberUsers
} from '../../../graphql/Push.gql'

export default {
	mixins: [api],
	components: { Table },
	data: () => ({
		table: {
			query,
			fields: {
				id: {
					name: 'ID',
					sortable: true,
					width: '1',
					align: 'center'
				},
				user: {
					name: 'User ID',
					sortable: true
				},
				userFullName: {
					name: 'User',
					link: { name: 'viewSubscriber' }
				},
				event: {
					name: 'Event',
					sortable: true,
					align: 'center',
					filterable() {
						return {
							list: this.$parent.$parent.events
						}
					}
				},
				app: {
					name: 'App',
					sortable: true,
					align: 'center',
					filterable() {
						return {
							list: this.$parent.$parent.apps
						}
					}
				},
				platform: {
					name: 'Platform',
					sortable: true,
					align: 'center',
					filterable() {
						return {
							list: this.$parent.$parent.platforms
						}
					}
				},
				lang: {
					name: 'Lang',
					sortable: true,
					width: '1',
					align: 'center',
					filterable() {
						return {
							list: this.$store.getters.langs
						}
					}
				},
				active: {
					name: 'Enabled',
					sortable: true,
					width: '1',
					align: 'center'
				},
				createdAt: {
					name: 'Created',
					sortable: true,
					nowrap: true,
					hook: ({ date }) => date
				},
				updatedAt: {
					name: 'Updated',
					sortable: true,
					nowrap: true,
					hook: ({ date }) => date
				}
			},
			actions: {
				new: {
					href: { name: 'addSubscriber' },
					text: 'Subscribe',
					position: 'top'
				},
				view: {
					href: { name: 'viewSubscriber' }
				},
				remove: {
					query: RemoveSubscribersByID
				},
				sendPush: {
					text: 'Send notification',
					class: 'hightlight',
					title: 'Send notification for selected users',
					position: 'bottom',
					click(e, table) {
						this.$router.push({
							name: 'sendNotification',
							query: {
								user: [
									...new Set(
										table.selected.map(
											id => table.rows.find(row => row.id === id).user
										)
									)
								]
							}
						})
					}
				}
			}
		}
	}),
	methods: {
		async join({ count, rows } = {}) {
			if (!count) return { count, rows }

			const { users: { rows: users = [] } = {} } =
				(await this.$query(PushSubscriberUsers, {
					id: [...new Set(rows.map(({ user }) => user))]
				})) || {}

			return {
				count,
				rows: rows.map(item => {
					const { fullName: userFullName = `User with ID "${item.user}" not found` } =
						users.find(user => item.user === user.id) || {}

					return Object.assign(item, { userFullName })
				})
			}
		}
	}
}
</script>

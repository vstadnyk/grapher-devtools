<template>
	<section>
		<Table
			:query="query"
			:fields="fields"
			:actions="actions"
			:data-hook="join"
		/>
	</section>
</template>

<script>
import Table from '../../../components/ui/Table/index.vue'
import {
	PushSubscribers,
	RemoveSubscribersByID,
	PushSubscriberUsers
} from '../../../graphql/Push.gql'

export default {
	components: { Table },
	data: () => ({
		query: PushSubscribers,
		fields: {
			id: {
				name: 'ID',
				sortable: true,
				width: '1',
				align: 'center'
			},
			user: {
				name: 'User ID',
				sortable: true,
				width: '1',
				align: 'center'
			},
			userFullName: {
				name: 'User Full name',
				sortable: false,
				link: '/notifications/subscribers/view/'
			},
			event: {
				sortable: true,
				width: '1',
				align: 'center'
			},
			app: {
				sortable: true,
				width: '1',
				align: 'center'
			},
			platform: {
				sortable: true,
				width: '1',
				align: 'center'
			},
			lang: {
				sortable: true,
				width: '1',
				align: 'center'
			},
			active: {
				sortable: true,
				width: '1',
				align: 'center'
			}
		},
		actions: {
			remove: {
				query: RemoveSubscribersByID
			}
		}
	}),
	methods: {
		async join({ count, rows } = {}) {
			if (!count) return { count, rows }

			this.$root.$app.$emit('loader', 'start')

			try {
				const { users: { rows: users = [] } = {} } =
					(await this.$api.query(PushSubscriberUsers, {
						// get all item.user as array with unique values
						id: [...new Set(rows.map(({ user }) => user))]
					})) || {}

				this.$root.$app.$emit('loader', 'done')

				return {
					count,
					rows: rows.map(item => {
						const { fullName: userFullName = `User with ID "${item.user}" not found` } =
							users.find(user => item.user === user.id) || {}

						return Object.assign(item, { userFullName })
					})
				}
			} catch (error) {
				this.$root.$app.$emit('loader', 'done')

				console.error(error)

				return { count, rows }
			}
		}
	}
}
</script>

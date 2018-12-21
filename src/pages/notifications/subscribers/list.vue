<template>
	<section>
		<Table
			:query="query"
			:fields="fields"
			:actions="actions"
			:filter="filter"
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
			userFullName: {
				name: 'User Full name',
				sortable: false,
				link: '/notifications/subscribers/view/'
			},
			user: {
				name: 'User ID',
				sortable: true,
				align: 'center'
			},
			event: {
				name: 'Event',
				sortable: true,
				align: 'center'
			},
			app: {
				name: 'App',
				sortable: true,
				align: 'center'
			},
			platform: {
				name: 'Platform',
				sortable: true,
				align: 'center'
			},
			lang: {
				name: 'Lang',
				sortable: true,
				width: '1',
				align: 'center'
			},
			active: {
				name: 'Enabled',
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
	computed: {
		filter() {
			const { apptype = null, appplatform = null } = this.$store.state.instance || {}

			const { events = null } = this.$store.state.pushTemplateData || {}

			return {
				user: { validType: Number },
				event: { validType: String, select: events },
				app: { validType: String, select: apptype },
				platform: { validType: String, select: appplatform }
			}
		}
	},
	async created() {
		if (!this.$store.state.pushTemplateData) await this.$parent.$parent.getData()
	},
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

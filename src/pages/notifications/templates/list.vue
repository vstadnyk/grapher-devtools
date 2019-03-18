<template>
	<Table v-bind="table" />
</template>

<script>
import Table from '../../../components/Table/index.vue'
import { PushTemplates as query, RemovePushTemplateByID } from '../../../graphql/Push.gql'

export default {
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
				title: {
					name: 'Title',
					sortable: true,
					searchable: true,
					valign: 'top',
					link: { name: 'editNotificationTemplate' }
				},
				body: {
					name: 'Body',
					sortable: true,
					searchable: true,
					valign: 'top'
				},
				event: {
					name: 'Event',
					sortable: true,
					filterable() {
						return {
							list: this.$parent.$parent.events
						}
					},
					align: 'center'
				},
				app: {
					name: 'App',
					sortable: true,
					align: 'center',
					filterable() {
						return {
							list: this.$store.getters.apptypes
						}
					}
				},
				platform: {
					name: 'Platform',
					sortable: true,
					align: 'center',
					filterable() {
						return {
							list: this.$store.getters.appplatforms
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
					href: { name: 'newNotificationTemplate' },
					position: 'top'
				},
				view: {
					href: { name: 'viewNotificationTemplate' }
				},
				edit: {
					href: { name: 'editNotificationTemplate' }
				},
				remove: {
					query: RemovePushTemplateByID
				}
			}
		}
	})
}
</script>

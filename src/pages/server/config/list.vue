<template>
	<Table v-bind="table" />
</template>

<script>
import Table from '../../../components/Table/index.vue'
import { Configs as query, RemoveByID } from '../../../graphql/Config.gql'

export default {
	components: { Table },
	data: () => ({
		table: {
			query,
			input: {
				params: {
					limit: 10,
					offset: 0,
					order: {
						column: 'key',
						sort: 'DESC'
					}
				}
			},
			fields: {
				id: {
					name: 'ID',
					sortable: true,
					align: 'center'
				},
				key: {
					name: 'Key',
					sortable: true,
					searchable: true,
					align: 'center',
					link: { name: 'editConfig' }
				},
				name: {
					name: 'Name',
					searchable: true
				},
				description: {
					name: 'Description',
					searchable: true
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
				},
				active: {
					name: 'Enabled',
					sortable: true,
					align: 'center',
					width: '1'
				}
			},
			options: {
				limitStep: 10,
				idKey: 'key',
				showCheckboxes: true
			},
			actions: {
				new: {
					href: { name: 'newConfig' },
					position: 'top'
				},
				edit: {
					href: { name: 'editConfig' }
				},
				view: {
					href: { name: 'viewConfig' }
				},
				remove: {
					query: RemoveByID
				}
			}
		}
	})
}
</script>

<template>
	<Table v-bind="table" />
</template>

<script>
import Table from '../../../components/Table/index.vue'
import { UserPermissions as query, RemovePermission } from '../../../graphql/UserPermission.gql'

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
				name: {
					name: 'Name',
					link: { name: 'editUserPermission' },
					sortable: true
				},
				alias: {
					name: 'Alias',
					sortable: true
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
					width: '1',
					align: 'center'
				}
			},
			actions: {
				new: {
					href: { name: 'newUserPermission' },
					position: 'top'
				},
				view: {
					href: { name: 'viewUserPermission' }
				},
				edit: {
					href: { name: 'editUserPermission' }
				},
				remove: {
					query: RemovePermission
				}
			}
		}
	})
}
</script>

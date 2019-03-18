<template>
	<Table v-bind="table" />
</template>

<script>
import Table from '../../components/Table/index.vue'
import { ContentsI18n as query, RemoveContent as remove } from '../../graphql/Content.gql'

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
					name: 'Subject',
					sortable: true,
					searchable: true,
					valign: 'top',
					link: { name: 'editContent' }
				},
				alias: {
					name: 'Alias',
					sortable: true,
					searchable: true
				},
				photo: {
					name: 'Photo',
					sortable: true,
					dataType: Image
				},
				position: {
					name: 'Position',
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
					href: { name: 'newContent' },
					position: 'top'
				},
				edit: {
					href: { name: 'editContent' }
				},
				view: {
					href: { name: 'viewContent' }
				},
				remove: {
					query: remove
				}
			}
		}
	})
}
</script>

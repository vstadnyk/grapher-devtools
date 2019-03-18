<template>
	<Table
		v-bind="table"
		:filter="{
			message: { searchable: true }
		}"
	/>
</template>

<script>
import Table from '../../../components/Table/index.vue'
import { MailTemplates as query, RemoveMailTemplateByID } from '../../../graphql/Mail.gql'

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
				subject: {
					name: 'Subject',
					sortable: true,
					searchable: true,
					valign: 'top',
					link: { name: 'editMailTemplate' }
				},
				alias: {
					name: 'Alias',
					sortable: true,
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
					width: '1',
					align: 'center'
				}
			},
			actions: {
				new: {
					href: { name: 'newMailTemplate' },
					position: 'top'
				},
				edit: {
					href: { name: 'editMailTemplate' }
				},
				view: {
					href: { name: 'viewMailTemplate' }
				},
				remove: {
					query: RemoveMailTemplateByID
				}
			}
		}
	})
}
</script>

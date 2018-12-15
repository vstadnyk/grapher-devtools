<template>
	<section>
		<p align="right">
			<router-link
				:to="'/notifications/templates/new'"
				class="btn hightlight"
				title="Add new template"
			>
				Add new
			</router-link>
		</p>
		<Table
			:query="query"
			:fields="fields"
			:actions="actions"
		/>
	</section>
</template>

<script>
import Table from '../../components/ui/Table/index.vue'
import { PushTemplates, RemovePushTemplateByID } from '../../graphql/Push.gql'

export default {
	components: { Table },
	data: () => ({
		query: PushTemplates,
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
				valign: 'top',
				link: '/notifications/templates/view/'
			},
			body: {
				name: 'Body',
				sortable: true,
				valign: 'top'
			},
			event: {
				name: 'Event',
				sortable: true,
				align: 'center',
				width: '1'
			},
			app: {
				name: 'App',
				sortable: true,
				align: 'center',
				width: '1'
			},
			platform: {
				name: 'Platform',
				sortable: true,
				align: 'center',
				width: '1'
			},
			active: {
				name: 'Enabled',
				sortable: true,
				width: '1',
				align: 'center'
			}
		},
		actions: {
			edit: {
				href: '/notifications/templates/edit/'
			},
			remove: {
				query: RemovePushTemplateByID
			}
		}
	})
}
</script>

<style scoped>
p {
	margin: 0;
	margin-bottom: 10px;
}
</style>

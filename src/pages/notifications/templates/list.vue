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
			:filter="filter"
		/>
	</section>
</template>

<script>
import Table from '../../../components/ui/Table/index.vue'
import { PushTemplates, RemovePushTemplateByID } from '../../../graphql/Push.gql'

import Form from '../../../controllers/form'

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
	}),
	async created() {
		if (!this.$store.state.pushTemplateData) await this.$parent.$parent.getData()
	},
	computed: {
		filter() {
			const { apptype = null, appplatform = null } = this.$store.state.instance || {}

			const { events = null } = this.$store.state.pushTemplateData || {}

			return {
				event: events ? Form.arrayToObject(events) : true,
				app: apptype ? Form.arrayToObject(apptype) : true,
				platform: appplatform ? Form.arrayToObject(appplatform) : true
			}
		}
	}
}
</script>

<style scoped>
p {
	margin: 0;
	margin-bottom: 10px;
}
</style>

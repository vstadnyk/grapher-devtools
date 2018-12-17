<template>
	<section>
		<Table
			v-if="!$route.params.date"
			:query="query"
			:fields="fields"
			:input="input"
			:options="options"
			:filter="filter"
		/>
		<router-view />
	</section>
</template>

<script>
import Table from '../../../components/ui/Table/index.vue'

import { ErrorsLog } from '../../../graphql/Logs.gql'

import Form from '../../../controllers/form'

export default {
	components: { Table },
	data: () => ({
		query: ErrorsLog,
		input: {
			params: {
				limit: 10,
				offset: 0,
				order: {
					column: 'date',
					sort: 'DESC'
				}
			}
		},
		fields: {
			type: {
				sortable: true,
				link: '/server/logs/errors/view/'
			},
			date: {
				sortable: true,
				align: 'center'
			},
			apptype: {
				sortable: true,
				width: '1',
				align: 'center'
			},
			appplatform: {
				sortable: true,
				width: '1',
				align: 'center'
			},
			operationName: {
				sortable: true,
				width: '1',
				align: 'center'
			}
		},
		options: {
			limitStep: 10,
			idKey: 'date'
		}
	}),
	computed: {
		filter() {
			const { apptype = null, appplatform = null } = this.$store.state.instance || {}

			return {
				type: true,
				date: true,
				operationName: true,
				apptype: apptype ? Form.arrayToObject(apptype) : true,
				appplatform: appplatform ? Form.arrayToObject(appplatform) : true
			}
		}
	}
}
</script>

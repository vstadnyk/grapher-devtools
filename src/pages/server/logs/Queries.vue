<template>
	<section>
		<Table
			v-if="!$route.params.date"
			:query="query"
			:fields="fields"
			:input="input"
			:options="options"
		/>
		<router-view />
	</section>
</template>

<script>
import Table from '../../../components/ui/Table/index.vue'

import { QueriesLog } from '../../../graphql/Logs.gql'

export default {
	components: { Table },
	data: () => ({
		query: QueriesLog,
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
			date: {
				sortable: true,
				link: '/server/logs/queries/view/'
			},
			apptype: {
				sortable: true,
				align: 'center'
			},
			appplatform: {
				sortable: true,
				align: 'center'
			},
			operationName: {
				sortable: true,
				align: 'center'
			}
		},
		options: {
			limitStep: 5,
			idKey: 'date'
		}
	})
}
</script>

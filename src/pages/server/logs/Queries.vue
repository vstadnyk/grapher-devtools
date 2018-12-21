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
				name: 'Datetime',
				sortable: true,
				link: '/server/logs/queries/view/',
				width: '25%'
			},
			apptype: {
				name: 'App',
				sortable: true,
				align: 'center',
				width: '25%'
			},
			appplatform: {
				name: 'Platform',
				sortable: true,
				align: 'center',
				width: '25%'
			},
			operationName: {
				name: 'Operation',
				sortable: true,
				align: 'center',
				width: '25%'
			}
		},
		options: {
			limitStep: 5,
			idKey: 'date'
		}
	}),
	computed: {
		filter() {
			const { apptype = null, appplatform = null } = this.$store.state.instance || {}

			return {
				apptype: { validType: String, select: apptype },
				appplatform: { validType: String, select: appplatform }
			}
		}
	}
}
</script>

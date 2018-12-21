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
				name: 'Error type',
				sortable: true,
				link: '/server/logs/errors/view/',
				width: '20%'
			},
			date: {
				name: 'Date',
				sortable: true,
				align: 'center',
				width: '20%'
			},
			apptype: {
				name: 'App',
				sortable: true,
				align: 'center',
				width: '20%'
			},
			appplatform: {
				name: 'Platform',
				sortable: true,
				align: 'center',
				width: '20%'
			},
			operationName: {
				name: 'Operation',
				sortable: true,
				align: 'center',
				width: '20%'
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
				apptype: { validType: String, select: apptype },
				appplatform: { validType: String, select: appplatform }
			}
		}
	}
}
</script>

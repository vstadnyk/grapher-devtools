<template>
	<article>
		<Table v-if="!$route.params.id" v-bind="table" />
		<router-view v-else />
	</article>
</template>

<script>
import Table from '../../../components/Table/index.vue'

import { ErrorsLog as query } from '../../../graphql/Logs.gql'

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
						column: 'date',
						sort: 'DESC'
					}
				}
			},
			fields: {
				type: {
					name: 'Error type',
					sortable: true,
					link: { name: 'viewErrorLog' },
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
					width: '20%',
					filterable() {
						return {
							list: this.$store.getters.apptypes
						}
					}
				},
				appplatform: {
					name: 'Platform',
					sortable: true,
					align: 'center',
					width: '20%',
					filterable() {
						return {
							list: this.$store.getters.appplatforms
						}
					}
				},
				operationName: {
					name: 'Operation',
					sortable: true,
					align: 'center',
					width: '20%'
				}
			},
			actions: {
				view: {
					href: { name: 'viewErrorLog' }
				}
			},
			options: {
				limitStep: 10,
				idKey: 'date',
				pagination: true
			}
		}
	})
}
</script>

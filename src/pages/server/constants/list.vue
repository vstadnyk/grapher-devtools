<template>
	<section>
		<Table
			:query="query"
			:fields="fields"
			:filter="filter"
			:actions="actions"
		/>
		<router-view />
	</section>
</template>

<script>
import Table from '../../../components/ui/Table/index.vue'
import { Constants, RemoveConstantByID } from '../../../graphql/Constants.gql'

export default {
	components: { Table },
	data: () => ({
		query: Constants,
		fields: {
			id: {
				name: 'ID',
				sortable: true,
				align: 'center',
				width: '1'
			},
			name: {
				name: 'Name',
				sortable: true,
				link: '/server/constants/view/'
			},
			key: {
				name: 'Key',
				sortable: true,
				align: 'center'
			},
			active: {
				name: 'Enabled',
				sortable: true,
				align: 'center',
				width: '1'
			}
		},
		actions: {
			edit: {
				href: '/server/constants/edit/'
			},
			remove: {
				query: RemoveConstantByID
			}
		}
	}),
	computed: {
		filter() {
			return {
				name: true,
				key: true
			}
		}
	}
}
</script>

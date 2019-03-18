<template>
	<Table v-bind="table" />
</template>

<script>
import Table from '../../components/Table/index.vue'
import { Locations as query, RemoveLocation } from '../../graphql/Location.gql'

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
				country: {
					name: 'Country',
					sortable: true,
					searchable: true,
					valign: 'top',
					link: { name: 'viewLocation' }
				},
				city: {
					name: 'City',
					sortable: true,
					searchable: true,
					valign: 'top',
					link: { name: 'viewLocation' }
				},
				street: {
					name: 'Street',
					sortable: true,
					searchable: true,
					valign: 'top',
					link: { name: 'viewLocation' }
				},
				building: {
					name: 'Building',
					sortable: true,
					searchable: true,
					width: '1',
					align: 'center'
				},
				name: {
					name: 'Name',
					sortable: true,
					searchable: true,
					width: '1',
					align: 'center'
				},
				active: {
					name: 'Enabled',
					sortable: true,
					width: '1',
					align: 'center'
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
				}
			},
			actions: {
				new: { href: { name: 'newLocation' }, position: 'top' },
				edit: { href: { name: 'editLocation' } },
				view: { href: { name: 'viewLocation' } },
				remove: { query: RemoveLocation }
			}
		}
	})
}
</script>

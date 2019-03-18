<template>
	<Table v-bind="table" />
</template>

<script>
import Table from '../../components/Table/index.vue'
import { Users as query, RemoveUsersByID } from '../../graphql/User.gql'

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
				fullName: {
					name: 'Full name',
					link: { name: 'editUser' },
					nowrap: true,
					sortable: true,
					searchable: true
				},
				firstName: {
					name: 'First name',
					sortable: true,
					searchable: true
				},
				lastName: {
					name: 'Last name',
					sortable: true,
					searchable: true
				},
				displayName: {
					name: 'Display name',
					sortable: true,
					searchable: true
				},
				mail: {
					name: 'Email',
					sortable: true,
					nowrap: true,
					searchable: true
				},
				permission: {
					name: 'Permission',
					hook: ({ alias }) => alias,
					filterable() {
						return {
							list: this.$store.getters.userPermissionsList
						}
					}
				},
				phone: {
					name: 'Phone',
					sortable: true,
					nowrap: true,
					searchable: true
				},
				photo: {
					name: 'Photo',
					sortable: true,
					dataType: Image
				},
				locations: {
					name: 'Locations',
					nowrap: true
				},
				defaultLocation: {
					name: 'Location',
					sortable: true
				},
				registerWith: {
					name: 'Register as',
					sortable: true
				},
				loginAt: {
					name: 'Last login',
					sortable: true,
					nowrap: true
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
					href: { name: 'newUser' },
					position: 'top'
				},
				view: {
					href: { name: 'viewUser' }
				},
				edit: {
					href: { name: 'editUser' }
				},
				remove: {
					query: RemoveUsersByID
				}
			}
		}
	})
}
</script>

<template>
	<router-view />
</template>

<script>
import api from '../../controllers/api'
import { UserPermissionsShort } from '../../graphql/UserPermission.gql'

export default {
	mixins: [api],
	async created() {
		await this.getUserPermissions()
	},
	methods: {
		async getUserPermissions() {
			if (!this.$store.state.userPermissions) {
				const { permissions: query = {} } =
					(await this.$query(UserPermissionsShort, {
						input: {
							active: true,
							params: {
								order: {
									column: 'id',
									sort: 'DESC'
								}
							}
						}
					})) || {}

				const { rows: permissions = [] } = query || {}

				this.$store.commit(
					'setUserPermissions',
					Object.assign(
						{},
						...(permissions || []).map(({ alias, id, name }) => ({
							[alias]: { id, name, alias }
						}))
					)
				)
			}

			return this.$store.state.userPermissions
		}
	}
}
</script>

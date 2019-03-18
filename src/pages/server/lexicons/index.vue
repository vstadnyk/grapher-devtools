<template>
	<router-view />
</template>

<script>
import api from '../../../controllers/api'
import { ServerLocales } from '../../../graphql/Info.gql'

export default {
	mixins: [api],
	async created() {
		if (!this.$store.state.serverLocales) {
			const { serverInfo: { locales = {} } = {} } = (await this.$query(ServerLocales)) || {}

			this.$store.commit('setServerLocales', locales)
		}
	}
}
</script>

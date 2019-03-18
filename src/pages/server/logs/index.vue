<template>
	<router-view />
</template>

<script>
import { LogConfig } from '../../../graphql/Logs.gql'
import api from '../../../controllers/api'

export default {
	mixins: [api],
	async created() {
		await this.config()
	},
	methods: {
		async config() {
			if (!this.$store.state.serverLogerConfig) {
				const { config } = (await this.$query(LogConfig)) || {}

				this.$store.commit('setServerLogerConfig', config ? config.apiLoger : null)
			}

			return this.$store.state.serverLogerConfig
		}
	}
}
</script>

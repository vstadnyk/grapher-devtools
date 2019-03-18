<template>
	<router-view />
</template>

<script>
import api from '../../controllers/api'
import { MailConfig } from '../../graphql/Mail.gql'
import { ServerLocales } from '../../graphql/Info.gql'

export default {
	mixins: [api],
	async created() {
		await this.config()
	},
	computed: {
		aliases() {
			const { template } = this.$store.state.mailConfig || {}

			if (!template) return []

			const { aliases = [] } = template || {}

			return aliases
		}
	},
	methods: {
		async config() {
			if (!this.$store.state.mailConfig) {
				const { config = {} } = (await this.$query(MailConfig)) || {}

				this.$store.commit('setMailConfig', config)
			}

			if (!this.$store.state.serverLocales) {
				const { serverInfo: { locales = {} } = {} } =
					(await this.$query(ServerLocales)) || {}

				this.$store.commit('setServerLocales', locales)
			}

			return this.$store.state.mailConfig
		}
	}
}
</script>

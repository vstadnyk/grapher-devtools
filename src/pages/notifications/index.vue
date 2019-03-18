<template>
	<router-view />
</template>

<script>
import { PushData } from '../../graphql/Push.gql'
import { ServerLocales } from '../../graphql/Info.gql'
import api from '../../controllers/api'

export default {
	mixins: [api],
	async created() {
		await this.config()
	},
	computed: {
		events() {
			const { events = null } = this.$store.state.pushTemplateData || {}

			return events
		},
		apps() {
			const { eventsPack = {} } = this.$store.state.pushTemplateData || {}

			return Object.keys(eventsPack || {})
		},
		platforms() {
			const { appsOnPlatfroms = {} } = this.$store.state.pushTemplateData || {}

			return Object.keys(appsOnPlatfroms || {})
		}
	},
	methods: {
		async config() {
			if (!this.$store.state.pushTemplateData) {
				const { pushTemplateData } = await this.$query(PushData)

				this.$store.commit('setPushTemplateData', pushTemplateData)
			}

			if (!this.$store.state.serverLocales) {
				const { serverInfo: { locales = {} } = {} } =
					(await this.$query(ServerLocales)) || {}

				this.$store.commit('setServerLocales', locales)
			}

			return this.$store.state.pushTemplateData
		}
	}
}
</script>

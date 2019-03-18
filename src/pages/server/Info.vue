<template>
	<article>
		<json-editor v-model="data" :brackets="false" :comma="false" />
		<hr />
		<p>
			<button @click="restart" class="btn">Restart</button>
			<button @click="stop" class="btn">Stop</button>
		</p>
	</article>
</template>

<script>
import JsonEditor from 'grapher-json-ui'
import 'grapher-json-ui/dist/index.css'

import { ServerInfo, RestartServer, StopServer } from '../../graphql/Info.gql'

import api from '../../controllers/api'

export default {
	components: { JsonEditor },
	mixins: [api],
	data: () => ({
		data: null
	}),
	async created() {
		const { serverInfo } = (await this.$query(ServerInfo)) || {}

		this.data = serverInfo
	},
	methods: {
		async restart() {
			if (window.confirm('Restart server?')) {
				await this.$query(RestartServer)

				this.$store.commit('isOnline', null)
			}
		},
		async stop() {
			if (window.confirm('Restart server?')) {
				await this.$query(StopServer)

				this.$store.commit('isOnline', null)
			}
		}
	}
}
</script>

<style scoped>
button {
	margin: 0 5px;
}
p {
	margin: 10px -5px;
}
</style>

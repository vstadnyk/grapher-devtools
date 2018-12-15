<template>
	<section>
		<Viewer v-if="serverInfo" :objectEntries="serverInfo"/>
		<hr>
		<p>
			<button @click="restart" class="btn">Restart</button>
			<button @click="stop" class="btn">Stop</button>
		</p>
	</section>
</template>

<script>
import { ServerInfo, RestartServer, StopServer } from '../../graphql/Info.gql'

import Viewer from '../../components/Viewer.vue'

export default {
	components: { Viewer },
	data: () => ({
		serverInfo: null
	}),
	async created() {
		this.$root.$app.$emit('loader', 'start')

		try {
			const { serverInfo } = await this.$api.query(ServerInfo)

			this.serverInfo = Object.entries(serverInfo)

			this.$root.$app.$emit('loader', 'done')
		} catch (error) {
			this.$parent.$emit('error', error)
		}
	},
	methods: {
		async restart() {
			if (!window.confirm('Restart server?')) return null

			this.$root.$app.$emit('loader', 'start')

			this.$store.commit('isOnline', null)

			try {
				await this.$api.mutate(RestartServer)

				this.$root.$app.$emit('loader', 'done')
			} catch (error) {
				this.$parent.$emit('error', error)
			}

			return true
		},
		async stop() {
			if (!window.confirm('Stop server?')) return null

			this.$root.$app.$emit('loader', 'start')

			try {
				await this.$api.mutate(StopServer)

				this.$store.commit('isOnline', null)

				this.$root.$app.$emit('loader', 'done')
			} catch (error) {
				this.$parent.$emit('error', error)
			}

			return true
		}
	}
}
</script>

<style scoped>
h1 {
	margin: 10px 0;
}
button {
	margin: 0 5px;
}
p {
	margin: 10px -5px;
}
</style>

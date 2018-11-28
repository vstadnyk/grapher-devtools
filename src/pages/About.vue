<template>
	<section>
		<Viewer v-if="serverInfo" :objectEntries="serverInfo"/>
	</section>
</template>

<script>
import { ServerInfo as query } from '../graphql/Info.gql'

import Viewer from '../components/ui/Viewer.vue'

export default {
	name: 'About',
	components: { Viewer },
	data: () => ({
		serverInfo: null
	}),
	async created() {
		try {
			const { serverInfo } = await this.$api.query(query)

			this.serverInfo = Object.entries(serverInfo)
		} catch (error) {
			console.error(error)
		}
	}
}
</script>

<style scoped>
h1 {
	margin: 10px 0;
}
</style>

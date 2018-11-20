<template>
	<section>
		<div v-if="$apollo.loading">Loading...</div>
		<Viewer v-if="serverInfo" :objectEntries="serverInfo"/>
	</section>
</template>

<script>
import { ServerInfo as query } from '../graphql/Info.gql'

import Viewer from '../components/ui/Viewer.vue'

export default {
	name: 'About',
	components: { Viewer },
	apollo: {
		serverInfo: {
			query,
			update: ({ serverInfo }) =>
				serverInfo
					? Object.entries(serverInfo).filter(
							([key, value]) => value && key !== '__typename'
					  )
					: null
		}
	}
}
</script>

<style scoped>
h1 {
	margin: 10px 0;
}
</style>

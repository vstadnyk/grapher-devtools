<template>
	<section>
		<div v-if="$apollo.loading">Loading...</div>
		<h1>Server information:</h1>
		<div v-if="serverInfo">
			<p v-for="row in serverInfo" :key="row.key">
				<b>{{ row.key }}:</b>
				{{ row.value }}
			</p>
		</div>
	</section>
</template>

<script>
import { ServerInfo as query } from '../graphql/Info.gql'

export default {
	name: 'Home',
	apollo: {
		serverInfo: {
			query,
			update: ({ serverInfo }) =>
				serverInfo
					? Object.entries(serverInfo)
							.filter(([key, value]) => value && key !== '__typename')
							.map(([key, value]) => ({ key, value }))
					: null
		}
	}
}
</script>

<style scoped>
h1 {
	margin: 0;
}
p {
	margin: 5px 15px;
}
b {
	text-transform: capitalize;
}
</style>

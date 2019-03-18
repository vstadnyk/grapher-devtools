<template>
	<header>
		<router-link to="/">Grapher</router-link>
		<i v-if="version">{{ version }}</i>
	</header>
</template>

<script>
import { ServerVersion as query } from '../graphql/Info.gql'
import api from '../controllers/api'

export default {
	mixins: [api],
	data: () => ({ version: null }),
	async created() {
		const { serverInfo: { version = null, instance = null } = {} } =
			(await this.$query(query)) || {}

		this.version = version
		this.$store.commit('setInstance', instance)
	}
}
</script>

<style scoped>
header {
	overflow: hidden;
	padding: 15px;
	background: #3d4045;
}
header * {
	vertical-align: middle;
}
a {
	font-size: 22px;
	text-transform: uppercase;
	padding: 0 10px;
	text-decoration: none;
	color: inherit;
}
a:hover {
	text-decoration: underline;
}
</style>

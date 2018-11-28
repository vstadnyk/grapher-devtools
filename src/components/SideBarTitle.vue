<template>
	<header>
		<a href="/">Grapher</a>
		<i v-if="version">{{ version }}</i>
	</header>
</template>

<script>
import { ServerVersion as query } from '../graphql/Info.gql'

export default {
	name: 'SideBarTitle',
	data: () => ({
		version: null
	}),
	async created() {
		try {
			const {
				serverInfo: { version }
			} = await this.$api.query({ query })

			this.version = version
		} catch (error) {
			console.error(error)
		}
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
header a {
	font-size: 22px;
	text-transform: uppercase;
	padding: 0 15px;
}
header img {
	width: 32px;
}
</style>

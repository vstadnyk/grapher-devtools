<template>
	<article>
		<back>← Back</back>
		<hr />
		<div v-if="data" class="rows">
			<div>
				<Map v-if="data.id" height="500px" :zoom="17" :lat-lng="[data.lat, data.lng]" />
			</div>
			<div class="json"><viewer v-bind="viewer" v-model="data" /></div>
		</div>
	</article>
</template>

<script>
import back from '../../components/BackLink.vue'
import Map from '../../components/Geo/map.vue'
import Viewer from '../../components/Viewer.vue'

import { Location_i18n as query } from '../../graphql/Location.gql'

export default {
	components: { back, Viewer, Map },
	data: () => ({
		data: {},
		viewer: {
			query,
			options: {
				backLink: false,
				border: true
			}
		}
	})
}
</script>

<style scoped>
.rows {
	display: grid;
	grid-template-columns: [col] auto [col] 350px;
	grid-template-rows: auto;
}
.json {
	padding-left: 15px;
}
</style>

<template>
	<div v-if="data">
		<h2><span>{{ type }}</span> log</h2>
		<p v-if="!output" align="center">Logs is empty</p>
		<Viewer v-if="output" :object-entries-table="Object.entries(output)" />
		<p v-if="output">
			<router-link :to="href" class="btn hightlight">Open</router-link>
			<button class="btn" @click="$parent.clear(type)">Clear</button>
		</p>
	</div>
</template>

<script>
import moment from 'moment'

import Viewer from '../../../components/Viewer.vue'

export default {
	components: { Viewer },
	props: {
		type: {
			type: String,
			default: 'errors'
		},
		data: {
			type: Object,
			default: () => null
		}
	},
	computed: {
		output() {
			const { count: Count, rows = [] } = this.data || {}

			if (!Count) return null

			const Last = rows
				.map(
					({
						type,
						date = moment(),
						apptype,
						appplatform,
						operationName,
						selections,
						variables
					}) => ({
						type,
						date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
						apptype,
						appplatform,
						operationName,
						selections,
						variables
					})
				)
				.find(row => row)

			return {
				Count,
				Last
			}
		},
		href() {
			return this.$route.path.concat('/', this.type)
		}
	}
}
</script>

<style scoped>
h2 {
	margin: 0;
	margin-bottom: 15px;
	color: #888;
	text-align: center;
}
h2 span {
	text-transform: capitalize;
}
p:not([align]) {
	margin: 0;
	margin-top: 15px;
	display: flex;
	justify-content: space-between;
}
</style>

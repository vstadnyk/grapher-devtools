<template>
	<article>
		<div class="rows">
			<div v-for="[type, log] in Object.entries({ errors, queries })" :key="type">
				<h2 align="center">{{ type }}</h2>
				<div class="border">
					<p v-if="loader[type]" align="center" v-text="loader[type]" />
					<template v-else>
						<p>
							<router-link v-if="log" :to="href.concat(type)" class="btn">
								Open
							</router-link>
							<button class="btn" @click="refresh(type)">Refresh</button>
							<button v-if="log" class="btn red" @click="clear(type)">Clear</button>
						</p>
						<p v-if="!log" align="center">Log is empty</p>
						<json v-else :value="log" />
					</template>
				</div>
			</div>
		</div>
	</article>
</template>

<script>
import Json from 'grapher-json-ui'
import 'grapher-json-ui/dist/index.css'

import { LatestLogs, ClearLog } from '../../../graphql/Logs.gql'
import api from '../../../controllers/api'
import { url as URL, getFileSize } from '../../../controllers/server'

export default {
	components: { Json },
	mixins: [api],
	data: () => ({
		file: {},
		errors: null,
		queries: null,
		loader: { errors: 'Loading...', queries: 'Loading...' }
	}),
	async created() {
		await Promise.all(['errors', 'queries'].map(type => this.refresh(type)))
	},
	computed: {
		href() {
			return this.$route.path.concat('/')
		}
	},
	methods: {
		async refresh(type) {
			this[type] = null
			this.loader[type] = 'Loading...'

			const { logs } = (await this.$query(LatestLogs, { type })) || {}

			this[type] = this.format(logs, type)
			this.loader[type] = null
		},
		async getFileInfo(type) {
			const config = await this.$parent.config()
			const { staticPath, [type]: { file: path } = {} } = config

			const url = path.replace(staticPath, URL)
			const size = await getFileSize(url)

			this[type].File = { url, size }
		},
		format(log = {}, logType = 'errors') {
			const { count: Count, rows = [] } = log || {}

			if (!Count) return null

			const Last = rows
				.map(
					({
						type,
						date,
						apptype,
						appplatform,
						operationName,
						selections,
						variables
					}) => ({
						type,
						date,
						apptype,
						appplatform,
						operationName,
						selections,
						variables
					})
				)
				.find(row => row)

			this.getFileInfo(logType)

			return { File: 'loading...', Count, Last }
		},
		async clear(type = 'errors') {
			if (window.confirm(`Clear ${type} log?`)) {
				await this.$query(
					ClearLog,
					{ type },
					{
						onSuccess: {
							message: 'Log cleared',
							reset: 1000,
							redirect: 1,
							onRedirect: () => {
								this[type] = null

								this.refresh(type)
							}
						}
					}
				)
			}
		}
	}
}
</script>

<style scoped>
.rows {
	display: grid;
	grid-template-columns: [col] 50% [col] 50%;
	grid-template-rows: auto;
	justify-content: space-between;
}
.rows > div {
	padding: 5px;
}
.rows > div > div {
	border: 1px solid #ccc;
	padding: 15px;
}
p:not([align]) {
	margin: 0;
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
}
.border {
	border: 1px solid #ccc;
	padding: 10px;
}
a {
	text-decoration: none;
	color: inherit;
}
h2 {
	text-transform: capitalize;
}
</style>

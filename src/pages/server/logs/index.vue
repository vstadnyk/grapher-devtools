<template>
	<section>
		<p v-if="error" v-text="error" class="error" />
		<p v-if="$route.matched.length < 3" align="center">
			<button class="btn hightlight" @click="refresh">Refresh</button>
		</p>
		<div v-if="$route.matched.length < 3">
			<div v-if="errors">
				<Info type="errors" :data="errors" />
			</div>
			<div v-if="queries">
				<Info type="queries" :data="queries" />
			</div>
		</div>
		<router-view />
	</section>
</template>

<script>
import Info from './Info.vue'

import { LogInfo, ClearLog } from '../../../graphql/Logs.gql'

export default {
	components: { Info },
	data: () => ({
		error: null,
		errors: null,
		queries: null
	}),
	watch: {
		$route() {
			this.error = null
		}
	},
	async created() {
		this.$on('error', error => {
			this.error = error.type

			console.error(error)

			this.$parent.$emit('loader', 'done')
		})

		if (this.$route.matched.length !== 3) await this.refresh()
	},
	methods: {
		async refresh() {
			this.$root.$app.$emit('loader', 'start')

			this.errors = null
			this.queries = null

			try {
				const { errors = null, queries = null } = (await this.$api.query(LogInfo)) || {}

				this.$root.$app.$emit('loader', 'done')

				this.errors = errors
				this.queries = queries
			} catch (error) {
				this.$emit('error', error)
			}
		},
		async clear(type = 'errors') {
			if (!window.confirm(`Clear ${type} logs?`)) return false

			this.$root.$app.$emit('loader', 'start')

			try {
				await this.$api.mutate(ClearLog, { type })

				this.$root.$app.$emit('loader', 'done')

				this[type] = null

				await this.refresh()
			} catch (error) {
				this.$emit('error', error)
			}

			return true
		}
	}
}
</script>

<style scoped>
section > div {
	display: grid;
	grid-template-columns: [col] 50% [col] 50%;
	grid-template-rows: auto;
	justify-content: space-between;
}
section > div > div {
	padding: 5px;
}
section > div > div > div {
	border: 1px solid #ccc;
	padding: 15px;
}
</style>

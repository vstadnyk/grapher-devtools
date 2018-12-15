<template>
	<section>
		<p>
			<BackLink />
		</p>
		<Viewer v-if="data" :objectEntriesTable="data"/>
	</section>
</template>

<script>
import BackLink from '../../../components/BackLink.vue'
import Viewer from '../../../components/Viewer.vue'

import { ViewLogRow } from '../../../graphql/Logs.gql'

export default {
	components: { BackLink, Viewer },
	data: () => ({
		data: null
	}),
	props: {
		type: {
			type: String,
			default: 'errors'
		}
	},
	async created() {
		const { type = 'errors' } = this
		const { date } = this.$route.params || {}

		this.$root.$app.$emit('loader', 'start')

		try {
			const { serverLog: { rows = [] } = {} } =
				(await this.$api.query(ViewLogRow, {
					type,
					date
				})) || {}

			this.$root.$app.$emit('loader', 'done')

			const row = rows.find(r => r.date === date)

			if (!row) {
				this.$parent.$emit('error', {
					type: 'NOT_FOUND',
					message: 'Row not found'
				})

				return null
			}

			this.data = Object.entries(row)
		} catch (error) {
			this.$parent.$emit('error', error)
		}

		return true
	}
}
</script>

<style scoped>
p {
	margin: 0;
	margin-bottom: 10px;
}
</style>

<template>
	<div>
		<p>
			<BackLink />
		</p>
		<Viewer v-if="data" :objectEntriesTable="data"/>
	</div>
</template>

<script>
import BackLink from '../../components/BackLink.vue'
import Viewer from '../../components/Viewer.vue'

import { PushTemplate } from '../../graphql/Push.gql'

export default {
	components: { BackLink, Viewer },
	data: () => ({
		data: null
	}),
	async created() {
		this.$root.$app.$emit('loader', 'start')

		try {
			const { pushTemplate_i18n: tmpl } = await this.$api.query(PushTemplate, {
				id: this.$route.params.id
			})

			this.$root.$app.$emit('loader', 'done')

			if (!tmpl) {
				this.$parent.$emit('error', {
					type: 'NOT_FOUND',
					message: 'Subscriber not found'
				})

				return null
			}

			this.data = Object.entries(tmpl)
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

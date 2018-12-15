<template>
	<section>
		<div>
			<h2>Push template data:</h2>
			<Viewer v-if="info" :objectEntriesTable="info"/>
		</div>
		<div>

		</div>
	</section>
</template>

<script>
import Viewer from '../../components/Viewer.vue'

import { PushData } from '../../graphql/Push.gql'

export default {
	components: { Viewer },
	data: () => ({
		info: null
	}),
	async created() {
		if (!this.$store.state.pushTemplateData) {
			this.$root.$app.$emit('loader', 'start')

			try {
				const { pushTemplateData } = await this.$api.query(PushData)

				this.$root.$app.$emit('loader', 'done')

				this.$store.commit('setPushTemplateData', pushTemplateData)
			} catch (error) {
				this.$parent.$emit('error', error)
			}
		}

		const { pushTemplateData } = this.$store.state

		if (pushTemplateData)
			this.info = Object.entries(pushTemplateData).filter(
				([key]) => !['apptype', 'appplatform', 'applang'].find(row => row === key)
			)
	}
}
</script>

<style scoped>
section {
	display: grid;
	grid-template-columns: [col] 300px [col] auto;
	grid-template-rows: auto;
}
h2 {
	margin: 0;
	margin-bottom: 10px;
	font-size: inherit;
}
</style>

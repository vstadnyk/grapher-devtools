<template>
	<section>
		<div>
			<p>
				<Generator />
			</p>
			<Viewer v-if="info" :objectEntriesTable="info"/>
		</div>
		<div>

		</div>
	</section>
</template>

<script>
import Viewer from '../../components/Viewer.vue'
import Generator from './generator.vue'

export default {
	components: { Viewer, Generator },
	data: () => ({
		info: null
	}),
	async created() {
		if (!this.$store.state.pushTemplateData) await this.$parent.getData()

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

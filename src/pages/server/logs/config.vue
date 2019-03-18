<template>
	<data-viewer :data="data" />
</template>

<script>
import dataViewer from '../../../components/Viewer.vue'

export default {
	components: { dataViewer },
	data: () => ({ data: {} }),
	async created() {
		this.data = await this.$parent.config()
	}
}
</script>

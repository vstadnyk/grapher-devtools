<template>
	<viewer :data="data" :options="{ backLink: false }" />
</template>

<script>
import Viewer from '../../components/Viewer.vue'

export default {
	components: { Viewer },
	data: () => ({ data: {} }),
	async created() {
		this.data = await this.$parent.config()
	}
}
</script>

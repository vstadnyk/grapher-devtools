<template>
	<section>
		<div>{{ id ? `ID# ${id}` : null }}</div>
		<buttons />
	</section>
</template>

<script>
import buttons from './buttons.vue'

export default {
	components: { buttons },
	props: {
		id: [Number, String]
	}
}
</script>

<style scoped>
section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}
</style>

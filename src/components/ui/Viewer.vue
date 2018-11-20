<template>
	<div v-if="objectEntries">
		<p  v-for="[key, value] in objectEntries" :key="key">
			<b>{{ key }}:</b>
			{{ value }}
		</p>
	</div>
</template>

<script>
export default {
	name: 'Viewer',
	props: {
		objectEntries: Array
	}
}
</script>

<style scoped>
p {
	margin: 5px 0;
}
b {
	text-transform: capitalize;
}
</style>

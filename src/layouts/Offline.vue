<template>
	<section>
		<h1 v-if="text" v-text="text"/>
	</section>
</template>

<script>
export default {
	name: 'Offline',
	computed: {
		text() {
			return !this.$store.state.isOnline ? 'Server is offline' : null
		}
	}
}
</script>

<style scoped>
section {
	height: 100vh;
	background: rgb(50, 54, 57);
	align-items: center;
	display: flex;
	justify-content: center;
}
</style>

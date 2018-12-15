<template>
	<section>
		<p v-if="error" v-text="error" class="error" />
		<router-view />
	</section>
</template>

<script>
export default {
	data: () => ({
		error: null
	}),
	watch: {
		$route() {
			this.error = null
		}
	},
	created() {
		this.$on('error', error => {
			this.error = error.type

			console.error(error)

			this.$parent.$emit('loader', 'done')
		})
	}
}
</script>

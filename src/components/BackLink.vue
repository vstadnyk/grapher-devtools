<template>
	<router-link :to="to || computed"><slot /></router-link>
</template>

<script>
export default {
	props: {
		filter: {
			type: Array,
			default: () => []
		},
		to: {
			type: Object,
			default: null
		}
	},
	computed: {
		computed() {
			const query = { ...this.$route.query }

			const { matched } = this.$route
			const { path = '/' } = matched[matched.length - 2] || {}

			this.filter.forEach(row => {
				delete query[row]
			})

			return { path, query }
		}
	}
}
</script>

<style scoped>
a {
	color: inherit;
	text-decoration: none;
}
a:hover {
	text-decoration: underline;
}
</style>

<template>
	<section>
		<h1>{{ title }}</h1>
	</section>
</template>

<script>
export default {
	data: () => ({
		title: null
	}),
	watch: {
		$route(route) {
			this.setTitle(route)
		}
	},
	created() {
		this.setTitle(this.$route)
	},
	methods: {
		setTitle({ matched }) {
			this.title = matched
				.map(({ meta: { title = null } = {} }) => title)
				.filter(row => row)
				.join(' ➠ ')

			document.title = this.title.concat(this.title ? ' | ' : '').concat('Grapher')
		}
	}
}
</script>

<style scoped>
section {
	border-bottom: 1px solid #ccc;
	height: calc(100% - 1px);
	padding: 0 15px;
	display: flex;
	align-items: center;
}
h1 {
	margin: 0;
	display: inline-block;
	color: #a0a0a0;
	font-weight: normal;
}
</style>

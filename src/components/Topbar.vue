<template>
	<section>
		<h1>{{ title }}</h1>
	</section>
</template>

<script>
export default {
	name: 'Topbar',
	data: () => ({
		title: null
	}),
	watch: {
		$route({ name, meta: { title } }) {
			this.setTitle(title || name)
		}
	},
	created() {
		this.setTitle(this.$route.meta.title || this.$route.name)
	},
	methods: {
		setTitle(title = null) {
			this.title = title
			document.title = `${title} | Grapher`
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
	text-transform: capitalize;
	color: #a0a0a0;
	font-weight: normal;
}
</style>

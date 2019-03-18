<template>
	<li>
		<template v-if="page === null && separator">{{ separator }}</template>
		<template v-else>
			<button v-if="current" disabled v-text="page" />
			<router-link v-else :to="{ query }" v-text="page" />
		</template>
	</li>
</template>

<script>
export default {
	props: {
		page: {
			type: Number,
			default: null
		}
	},
	computed: {
		current() {
			return this.page === this.$parent.current
		},
		separator() {
			return this.$parent.separator
		},
		query() {
			const { page } = this

			const query = Object.assign({}, this.$route.query)

			delete query.page

			if (!page) return null

			if (page === 1) return query

			return Object.assign(query, { page })
		}
	}
}
</script>

<style scoped>
li {
	display: inline-flex;
	padding: 3px;
}
li > * {
	padding: 5px 10px;
	border: 0;
	border-radius: 0;
	font-size: inherit;
	font-family: inherit;
	background: #ccc;
	color: inherit;
	text-decoration: none;
}
li > *:not(button):hover {
	text-decoration: none;
	background-color: #eee;
}
button {
	cursor: default;
	background: var(--hl);
	color: var(--hl-color);
}
</style>

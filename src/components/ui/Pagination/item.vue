<template>
	<span>
		<button v-if="active" class="btn hightlight" disabled>{{ page }}</button>
		<router-link
			class="btn"
			v-if="!active"
			:to="{ query }"
		>
			{{ page }}
		</router-link>
	</span>
</template>

<script>
export default {
	name: 'PaginationItem',
	props: {
		page: {
			type: Number,
			default: 1
		},
		active: {
			type: Boolean,
			default: false
		}
	},
	computed: {
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
a,
button {
	padding: 5px 10px;
}
</style>

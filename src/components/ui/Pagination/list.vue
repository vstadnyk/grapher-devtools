<template>
	<ul v-if="count && pages > 1">
		<li v-for="(value, page) in new Array(pages)" :key="page">
			<PaginationItem :page="page + 1" :active="page + 1 === current" />
		</li>
	</ul>
</template>

<script>
import PaginationItem from './item.vue'

export default {
	name: 'Pagination',
	components: { PaginationItem },
	data: () => ({
		current: 1,
		pages: null
	}),
	props: {
		count: {
			type: Number,
			default: 1
		},
		limit: {
			type: Number,
			default: 10
		}
	},
	created() {
		const { count, limit } = this

		this.pages = Math.round(count / limit)

		this.$on('paginate', page => {
			this.current = page

			this.$parent.$emit('paginate', page)
		})
	}
}
</script>

<style scoped>
ul,
li {
	list-style: none;
	margin: 0;
	padding: 0;
}
ul {
	margin: 0 -3px;
}
li {
	display: inline-block;
	padding: 3px;
}
</style>

<template>
	<ul v-if="count && count > limit">
		<li>
			<PaginationItem :page="1" :active="current === 1" />
		</li>
		<li v-if="!chunk.find(r => r === 2)">...</li>
		<li v-for="page in chunk" :key="page">
			<PaginationItem :page="page" :active="page === current" />
		</li>
		<li v-if="!chunk.find(r => r === pages) && !chunk.find(r => r === pages - 1)">...</li>
		<li v-if="!chunk.find(r => r === pages)">
			<PaginationItem :page="pages" :active="pages === current" />
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
		},
		chunkSize: {
			type: Number,
			default: 5
		}
	},
	watch: {
		$route({ query: { page = null } } = {}) {
			this.current = parseInt(page, 0) || 1
		},
		limit() {
			this.calc()
		},
		count() {
			this.calc()
		}
	},
	computed: {
		chunk() {
			let step = 2

			const max = this.pages - this.chunkSize + 1

			if (this.chunkSize - this.current <= 0) step += this.current - this.chunkSize

			if (step >= max) step = max

			if (this.limit === 1) step -= 1
			if (this.limit === 1 && this.current !== 1) step -= 1

			const chunk = Object.keys(new Array(this.chunkSize).fill(0)).map(
				r => parseInt(r, 0) + step
			)

			return chunk.filter(r => r > 1)
		}
	},
	methods: {
		calc() {
			this.pages = Math.ceil(this.count / this.limit)

			const { page = 1 } = this.$route.query

			this.current = parseInt(page, 0)
		}
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
	display: inline-block;
}
li {
	display: inline-block;
	padding: 3px;
}
</style>

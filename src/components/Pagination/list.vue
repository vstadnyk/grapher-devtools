<template>
	<ul v-if="show && !hide">
		<item :page="1" />
		<item v-if="current >= size" />
		<item v-for="page in chunk" :key="page" :page="page" />
		<item v-if="step + size <= total" />
		<item v-if="last" :page="total" />
	</ul>
</template>

<script>
import item from './item.vue'

export default {
	components: { item },
	props: {
		hide: {
			type: Boolean,
			default: false
		},
		count: {
			type: Number,
			default: 1
		},
		limit: {
			type: Number,
			default: 10
		},
		size: {
			type: Number,
			default: 5
		},
		separator: {
			type: String,
			default: '...'
		}
	},
	watch: {
		current(page) {
			this.$emit('input', page)
		}
	},
	computed: {
		step() {
			const step = this.current - this.size + 2

			if (step >= this.max) return this.max

			if (step <= 0) return 1

			return step
		},
		chunk() {
			return Object.keys(new Array(this.size).fill(0))
				.map(key => parseInt(key, 0) + this.step)
				.filter(key => key > 1 && key < this.total)
		},
		max() {
			return this.total - this.size + 1
		},
		total() {
			return Math.ceil(this.count / this.limit)
		},
		current() {
			return parseInt(this.$route.query.page || 1, 0)
		},
		show() {
			return this.count && this.count > this.limit
		},
		last() {
			return !this.chunk.find(key => key === this.total)
		}
	}
}
</script>

<style scoped>
ul {
	padding: 0;
	margin: 0 -3px;
	display: inline-block;
}
</style>

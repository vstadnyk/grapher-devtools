<template>
	<router-link :to="{ query }">
		<slot /><span v-if="name === column">{{ sort === 'DESC' ? '↓' : '↑' }}</span>
	</router-link>
</template>

<script>
export default {
	props: {
		value: {
			type: Object,
			default: () => ({})
		},
		name: {
			type: String,
			default: null
		}
	},
	watch: {
		sort() {
			this.emit()
		}
	},
	created() {
		if (this.$route.query.sort) this.emit()
	},
	methods: {
		emit() {
			const { column, sort } = this

			if (this.column === this.name) this.$emit('input', { column, sort })
		}
	},
	computed: {
		column() {
			return this.$route.query.column || this.value.column
		},
		sort() {
			const { sort = 'DESC' } = this.$route.query || this.value || {}

			return sort.toUpperCase()
		},
		query() {
			return Object.assign(
				{ ...this.$route.query },
				{
					column: this.name,
					sort: this.sort === 'DESC' ? 'ASC' : 'DESC'
				}
			)
		}
	}
}
</script>

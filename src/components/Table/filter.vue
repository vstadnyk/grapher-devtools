<template>
	<p v-if="list"><Select v-model="model" :options="list" /></p>
</template>

<script>
import Select from '../Elements/Select.vue'

export default {
	components: { Select },
	props: {
		fields: {
			type: Object,
			default: null
		},
		column: String,
		value: null
	},
	created() {
		if (this.model) this.$emit('input', this.filter())
	},
	computed: {
		model: {
			get() {
				return Object.entries(this.$route.query)
					.map(([row, value]) => (row === this.column ? value : null))
					.find(row => row)
			},
			set(value) {
				const query = Object.assign({}, this.$route.query)

				const filter = { [this.column]: value }

				Object.assign(query, filter)

				if (!value) delete query[this.column]

				this.$router.push({ query })

				this.$emit('input', this.filter())
			}
		},
		list() {
			return this.data.select || this.data.list || null
		},
		data() {
			return this.fields[this.column] || {}
		}
	},
	methods: {
		filter() {
			return Object.assign(
				...Object.entries(this.$route.query)
					.filter(([key]) => Object.keys(this.fields).find(row => row === key))
					.map(([key, value]) => ({ [key]: value }))
					.concat([{}])
			)
		}
	}
}
</script>

<style scoped>
p {
	margin: 0;
	margin-top: 5px;
}
</style>

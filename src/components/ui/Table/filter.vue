<template>
	<p>
		<Input
			type="search"
			:datalist="datalist"
			:name="name"
			:id="name"
			:value="value"
		/>
	</p>
</template>

<script>
import Input from '../elements/Input.vue'

export default {
	components: { Input },
	props: {
		datalist: {
			type: null,
			default: null
		},
		name: String
	},
	created() {
		this.$on(`${this.name}Change`, this.setQuery)
	},
	computed: {
		value() {
			return this.query[this.name] || null
		},
		query() {
			try {
				return JSON.parse(this.$route.query.filter || '{}')
			} catch (error) {
				return {}
			}
		}
	},
	methods: {
		setQuery(value) {
			const { query } = this.$route

			const params = Object.entries(
				Object.assign({}, this.query, {
					[this.name]: value
				})
			).filter(([k, v]) => k && v)

			const filter = params.length
				? JSON.stringify(Object.assign(...params.map(([k, v]) => ({ [k]: v }))))
				: null

			delete query.filter

			this.$router.push({
				query: Object.assign({}, query, { filter })
			})

			if (!filter) this.$router.push({ query })
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

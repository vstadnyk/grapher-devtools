<template>
	<p>
		<Input
			v-if="!list"
			:name="name"
			:value="value"
			:type="type"
			:validType="validType"
			@change="setQuery"
		/>
		<Select
			v-if="list"
			:name="name"
			:value="value"
			:validType="validType"
			:options="list"
			@change="setQuery"
		/>
	</p>
</template>

<script>
import Input from '../elements/Input.vue'
import Select from '../elements/Select.vue'

export default {
	components: { Input, Select },
	props: {
		data: {
			type: Object,
			default: null
		},
		name: String
	},
	data: () => ({
		error: null,
		val: null
	}),
	computed: {
		value() {
			return this.query[this.name] || null
		},
		validType() {
			const { validType = String, searchable = null } = this.data

			return searchable || validType
		},
		type() {
			return 'text'
		},
		list() {
			return this.data.select || null
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
		getRouteParam(value = null, key = 'filter') {
			const params = JSON.parse(this.$route.query[key] || '{}')

			delete params[this.name]

			if (value)
				Object.assign(params, {
					[this.name]: value
				})

			return params
		},
		setQuery(value = null) {
			const query = Object.assign({}, this.$route.query)
			const filter = this.getRouteParam(value)

			Object.assign(query, { filter: JSON.stringify(filter) })

			if (!Object.values(filter).length) delete query.filter

			this.$router.push({ query })
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

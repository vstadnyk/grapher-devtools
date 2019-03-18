<template>
	<form v-if="fields" @submit.prevent="submit">
		<p><b>Search by fields: </b>{{ Object.keys(fields || {}).join(', ') }}</p>
		<div>
			<Input
				type="search"
				name="search"
				:value="model"
				:valid-type="String"
				placeholder="Search..."
				@change="change"
			/>
			<button class="btn hightlight">Search</button>
		</div>
	</form>
</template>

<script>
import Input from '../Elements/Input.vue'

export default {
	components: { Input },
	props: {
		value: null,
		fields: {
			type: Object,
			default: null
		}
	},
	created() {
		if (this.model) this.$emit('input', { columns: this.columns, search: this.model })
	},
	computed: {
		columns() {
			return Object.keys(this.fields)
		},
		model: {
			get() {
				return this.$route.query.search
			},
			set(value) {
				const query = Object.assign({}, this.$route.query)

				const search = { columns: this.columns, search: value }

				if (value && value.length > 2) {
					this.$router.push({
						query: Object.assign({}, query, { search: value })
					})

					this.$emit('input', search)
				}

				if (!value) {
					delete query.search

					this.$router.push({ query })

					this.$emit('input', {})
				}
			}
		}
	},
	methods: {
		submit({
			target: {
				search: { value }
			}
		}) {
			this.model = value
		},
		change(value) {
			if (!value) this.model = null
		}
	}
}
</script>

<style scoped>
p {
	margin: 0;
	margin-bottom: 5px;
	font-size: 11px;
	color: darkgray;
}
div {
	display: flex;
	grid-template: auto auto;
	grid-column-gap: 10px;
	padding-bottom: 8px;
}
</style>

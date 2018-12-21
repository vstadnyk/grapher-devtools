<template>
	<form @submit.prevent="submit">
		<div>
			<Input
				type="search"
				name="search"
				:value="value"
				:valid-type="String"
				:placeholder="`Search in ${Object.keys(fields).join(', ')}`"
				@change="change"
			/>
		</div>
		<div>
			<button class="btn hightlight">Search</button>
		</div>
	</form>
</template>

<script>
import Input from '../elements/Input.vue'

export default {
	components: { Input },
	props: {
		fields: {
			type: Object,
			default: null
		}
	},
	computed: {
		value() {
			const { search = '{}' } = this.$route

			try {
				const { iLike: value = null } = JSON.parse(search) || {}

				return value
			} catch (error) {
				return null
			}
		}
	},
	methods: {
		submit({
			target: {
				search: { value }
			}
		}) {
			if (value.length > 2) {
				this.$router.push({
					query: Object.assign({}, this.$route.query, {
						search: JSON.stringify({
							columns: Object.keys(this.fields),
							iLike: `%${value}%`
						})
					})
				})
			}
		},
		change(value) {
			if (!value) {
				const query = Object.assign({}, this.$route.query)

				delete query.search

				this.$router.push({ query })
			}
		}
	}
}
</script>

<style scoped>
p {
	margin: 0;
}
form {
	display: flex;
	margin-bottom: 10px;
}
</style>

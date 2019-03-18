<template>
	<header>
		<search :fields="searchFields" v-model="$parent.search" />
		<div class="buttons" v-if="buttons"><actions :actions="buttons" /></div>
	</header>
</template>

<script>
import Search from './search.vue'
import Actions from './actions.vue'

export default {
	components: { Search, Actions },
	computed: {
		buttons() {
			return this.$parent.getActions('top')
		},
		searchFields() {
			const fields = Object.assign(
				{},
				...Object.entries(this.$parent.fields)
					.filter(([i, { searchable = null }]) => i && searchable)
					.map(([i, v]) => ({ [i]: v }))
					.concat([{}])
			)

			if (!Object.keys(fields).length) return null

			return fields
		}
	}
}
</script>

<style scoped>
header {
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #ccc;
}
.buttons {
	padding-bottom: 10px;
}
</style>

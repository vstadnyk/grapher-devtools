<template>
	<thead>
		<tr>
			<th v-if="$parent.showCheckboxes" width="1">
				<input type="checkbox" v-model="$parent.selectAll" />
			</th>
			<th
				v-for="[column, { sortable, filterable, name, width }] in Object.entries(
					$parent.fields
				)"
				:key="column"
				:valign="filterable ? 'top' : 'middle'"
				:width="width"
			>
				<sort v-if="sortable" :name="column" v-model="$parent.order">{{
					name || column
				}}</sort>
				<template v-else>{{ name || column }}</template>

				<filter-rows
					v-if="filterable"
					:column="column"
					:fields="filterFields"
					v-model="$parent.filter"
				/>
			</th>
			<th v-if="$parent.getActions('row')" width="1">
				<actions
					v-if="Object.keys($route.query).length"
					:actions="resetButton"
					:table="$parent"
				/>
			</th>
		</tr>
	</thead>
</template>

<script>
import Actions from './actions.vue'
import filterRows from './filter.vue'
import Sort from './sort.vue'

export default {
	components: { Actions, filterRows, Sort },
	data: () => ({
		resetButton: {
			reset: {
				title: 'Reset filters',
				text: 'Reset',
				class: 'hightlight',
				click() {
					this.$router.push({ query: {} })
				}
			}
		}
	}),
	computed: {
		filterFields() {
			const fields = Object.assign(
				{},
				...Object.entries(this.$parent.fields)
					.filter(([i, { filterable = null }]) => i && filterable instanceof Function)
					.map(([i, { filterable }]) => ({ [i]: filterable.call(this.$parent.target) }))
					.concat([{}])
			)

			if (!Object.keys(fields).length) return null

			return fields
		}
	}
}
</script>

<style scoped>
th {
	border: 1px solid #ccc;
	padding: 5px;
	text-align: center;
}
a {
	white-space: nowrap;
	color: inherit;
	text-decoration: none;
}
a:hover {
	text-decoration: underline;
}
</style>

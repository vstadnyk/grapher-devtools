<template>
	<tbody v-if="$parent.count">
		<tr
			v-for="(item, i) in $parent.rows"
			:key="i"
			@click="click($parent.getId(item))"
			@dblclick="dblclick"
		>
			<td v-if="$parent.showCheckboxes" align="center" width="1">
				<input type="checkbox" v-model="$parent.selected" :value="$parent.getId(item)" />
			</td>
			<cell
				v-for="[
					column,
					{ alias, width, align, valign, link, dataType, nowrap, hook } = {}
				] in Object.entries($parent.fields)"
				:key="column"
				:width="width"
				:nowrap="nowrap"
				:align="align"
				:valign="valign"
				:link="link"
				:dataType="dataType"
				:hook="hook"
				:id="$parent.getId(item)"
				:value="item[alias] || item[column]"
			>
				{{ item[alias] || item[column] }}
			</cell>
			<td v-if="$parent.getActions('row')">
				<actions
					:id="$parent.getId(item)"
					:actions="$parent.getActions('row')"
					:table="$parent"
				/>
			</td>
		</tr>
	</tbody>
</template>

<script>
import cell from './cell.vue'
import actions from './actions.vue'

export default {
	components: { cell, actions },
	methods: {
		click(id) {
			const i = this.$parent.selected.indexOf(id)

			return i !== -1 ? this.$parent.selected.splice(i, 1) : this.$parent.selected.push(id)
		},
		dblclick() {
			this.$parent.selectAll = true
		}
	}
}
</script>

<style scoped>
td {
	border: 1px solid #ccc;
	padding: 5px;
}
tr:hover {
	background-color: gainsboro;
}
</style>

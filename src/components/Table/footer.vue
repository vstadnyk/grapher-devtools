<template>
	<footer v-if="Object.keys(buttons).length || $parent.options.pagination">
		<div>
			<div class="buttons" v-if="Object.keys(buttons).length">
				<actions :actions="buttons" :table="$parent" />
			</div>
			<limiter
				:count="$parent.count"
				:step="$parent.options.limitStep"
				v-model="$parent.limit"
			/>
		</div>
		<pagination
			:hide="!$parent.options.pagination"
			:count="$parent.count"
			:limit="$parent.limit"
			v-model="$parent.offset"
		/>
	</footer>
</template>

<script>
import Actions from './actions.vue'
import Limiter from './limiter.vue'
import Pagination from '../Pagination/list.vue'

export default {
	components: { Actions, Limiter, Pagination },
	computed: {
		removeButton() {
			if (!(this.$parent.actions || {}).remove) return {}

			return { remove: { title: 'Remove selected', click: this.$parent.remove } }
		},
		buttons() {
			return Object.assign(
				{},
				...Object.entries(
					Object.assign(this.removeButton, this.$parent.getActions('bottom') || {})
				)
					.filter(
						([key, { select = ({ selected = [] }) => selected.length > 0 }]) =>
							key && select.call(this.$parent.target, this.$parent)
					)
					.map(([key, value]) => ({ [key]: value }))
					.concat([{}])
			)
		}
	}
}
</script>

<style scoped>
footer {
	display: flex;
	justify-content: space-between;
	padding-top: 10px;
	border-top: 1px solid #ccc;
	align-items: flex-end;
}
footer:empty {
	display: none;
}
footer > div {
	display: flex;
}
.buttons {
	padding-right: 10px;
	display: flex;
	justify-content: space-between;
}
</style>

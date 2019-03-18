<template>
	<p v-if="actions">
		<action
			v-for="(action, type) in actions"
			:key="type"
			:id="id"
			:action="action"
			:type="type"
			:table="table"
		/>
	</p>
</template>

<script>
import action from './action.vue'

export default {
	components: { action },
	props: {
		id: {
			type: [String, Number],
			default: null
		},
		actions: {
			type: Object,
			default: null
		},
		table: {
			type: null,
			default: null
		}
	}
}
</script>

<style scoped>
p {
	white-space: nowrap;
	margin: 0 -3px;
}
p > * {
	margin: 0 3px;
}
</style>

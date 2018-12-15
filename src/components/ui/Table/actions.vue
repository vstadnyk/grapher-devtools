<template>
	<td>
		<action
			v-for="(action, type) in actions"
			:key="type"
			:id="id"
			:action="action"
			:type="type"
		/>
	</td>
</template>

<script>
import action from './action.vue'

export default {
	components: { action },
	props: {
		id: String,
		actions: Object
	}
}
</script>

<style scoped>
td {
	white-space: nowrap;
	margin: 0 -3px;
}
</style>

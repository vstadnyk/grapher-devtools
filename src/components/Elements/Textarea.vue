<template>
	<Label v-bind="{ label, required, lang }">
		<textarea
			v-model="model"
			v-bind="Object.assign({ ...bind }, { cols, rows })"
			:class="error ? 'error' : null"
		/>
	</Label>
</template>

<script>
import input from './input'

export default {
	mixins: [input],
	props: {
		cols: {
			type: Number,
			default: null
		},
		rows: {
			type: Number,
			default: null
		}
	}
}
</script>

<style scoped>
textarea {
	font-family: inherit;
	font-size: inherit;
	border: 1px solid #ccc;
	padding: 7px;
	width: 100%;
	max-width: calc(100% - 16px);
	min-height: 200px;
}
*:disabled {
	background-color: #eee;
}
.error {
	border-color: red;
	color: inherit;
}
</style>

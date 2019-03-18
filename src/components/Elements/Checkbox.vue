<template>
	<label>
		<input v-model="model" type="checkbox" v-bind="bind" />
		<span v-if="label"><sup v-if="required && label">*</sup>{{ label }}</span>
	</label>
</template>

<script>
import input from './input'

export default {
	mixins: [input]
}
</script>

<style scoped>
label input {
	display: none;
}
input:checked + span:before {
	content: '☑︎';
	color: rgba(0, 128, 128, 1);
}
input:checked + span {
	background: rgba(204, 204, 204, 0.3);
}
span {
	cursor: pointer;
	display: flex;
	padding: 7px;
	align-items: center;
}
span:before {
	content: '☐';
	font-size: 30px;
	line-height: 24px;
	margin-right: 5px;
}
</style>

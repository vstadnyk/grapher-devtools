<template>
	<button @click="click" :class="`btn${active ? ' hightlight' : ''}`" :disabled="active" :value="page">{{ page }}</button>
</template>

<script>
export default {
	name: 'PaginationItem',
	props: {
		page: {
			type: Number,
			default: 1
		},
		active: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		click({ target: { value } }) {
			this.$parent.$emit('paginate', parseFloat(value))
		}
	}
}
</script>

<style scoped>
button {
	padding: 5px 10px;
}
</style>

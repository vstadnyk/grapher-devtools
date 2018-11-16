<template>
	<span :class="status"/>
</template>

<script>
export default {
	name: 'Indicator',
	props: {
		status: {
			type: String,
			default() {
				return 'red'
			}
		}
	}
}
</script>

<style scoped>
span {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 1000px;
}
span.green {
	background: green;
}
span.red {
	background: orangered;
}
</style>

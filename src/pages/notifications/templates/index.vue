<template>
	<section>
		<router-view></router-view>
	</section>
</template>

<script>
export default {
	created() {
		this.$on('error', error => this.$parent.$emit('error', error))
	}
}
</script>

<template>
	<section>
		<back>←Back</back>
		<h1>401 Forbiden</h1>
		<div>Permission denied "{{ rule }}"</div>
	</section>
</template>

<script>
import back from '../components/BackLink.vue'

export default {
	components: { back },
	computed: {
		rule() {
			const { meta: { permission = undefined } = {} } = this.$route

			return permission || 'undefined'
		}
	}
}
</script>

<style scoped>
h1 {
	color: #666;
	font-size: 32px;
	margin: 15px 0;
}
</style>

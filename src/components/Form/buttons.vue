<template>
	<div>
		<back v-if="cancel" v-text="cancel" :filter="['lang', 'tab']" />
		<button v-if="submit" type="submit" class="btn hightlight" v-text="submit" />
	</div>
</template>

<script>
import back from '../BackLink.vue'

export default {
	components: { back },
	props: {
		submit: {
			type: String,
			default: 'Save'
		},
		cancel: {
			type: String,
			default: 'Cancel'
		}
	}
}
</script>

<style scoped>
div {
	display: flex;
	align-items: center;
}
a {
	color: inherit;
	margin-right: 10px;
}
a:hover {
	text-decoration: none;
}
</style>

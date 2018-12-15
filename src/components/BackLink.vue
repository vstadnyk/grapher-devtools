<template>
	<router-link :to="back" v-text="text"/>
</template>

<script>
export default {
	props: {
		text: {
			type: String,
			default: '← Back'
		}
	},
	computed: {
		back() {
			const { matched } = this.$route
			const { path } = matched[matched.length - 2]

			return path
		}
	}
}
</script>

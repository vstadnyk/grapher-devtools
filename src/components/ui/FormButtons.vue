<template>
	<span>
		<span v-if="cancel" @click="back" class="btn">{{ cancel }}</span>
		<button v-if="submit" type="submit" class="btn hightlight">{{ submit }}</button>
	</span>
</template>

<script>
export default {
	props: {
		submit: {
			type: String,
			default: 'Save'
		},
		cancel: {
			type: String,
			default: 'Cancel'
		}
	},
	methods: {
		back() {
			const { matched } = this.$route

			this.$router.push(matched[matched.length - 2])
		}
	}
}
</script>

<style scoped>
span {
	display: inline-block;
	margin: 0 -5px;
}
button,
span {
	margin: 0 5px;
}
</style>

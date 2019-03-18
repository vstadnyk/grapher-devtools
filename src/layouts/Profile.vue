<template>
	<section>
		<form @submit.prevent="$emit('submit')"><button class="btn">Logout</button></form>
	</section>
</template>

<script>
import controller from '../components/Form/controller'
import { Logout as mutation } from '../graphql/User.gql'

export default {
	mixins: [controller],
	methods: {
		async submit() {
			await this.$query(
				mutation,
				{},
				{
					onSuccess: {
						message: 'Session logout',
						reset: 1000,
						onReset: () => {
							this.$root.$app.$refs.login.$emit('logout')

							return true
						}
					}
				}
			)
		}
	}
}
</script>

<style scoped>
section {
	padding-right: 15px;
	padding-top: 10px;
	padding-bottom: 5px;
}
section > form {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-size: 13px;
	height: 100%;
}
button {
	padding: 5px 10px;
}
</style>

<template>
	<section>
		<div>
			<button class="btn" @click.prevent="logout">Logout</button>
		</div>
	</section>
</template>

<script>
import { Logout as mutation, CurrentUser as query } from '../graphql/User.gql'

export default {
	name: 'Logout',
	async created() {
		/* const { user } = await this.$api.query(query)

		if (user) this.$store.commit('setUser', user) */
	},
	methods: {
		async logout() {
			this.$parent.$emit('loader', 'start')

			try {
				await this.$api.mutate(mutation)
			} catch (error) {
				console.error(error)
			}

			this.$store.commit('logout')
			this.$parent.$emit('loader', 'done')
		}
	}
}
</script>

<style scoped>
section {
	border-bottom: 1px solid #ccc;
	padding-right: 15px;
}
section > div {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	overflow: hidden;
	font-size: 13px;
	height: 100%;
}
button {
	padding: 5px 10px;
}
</style>

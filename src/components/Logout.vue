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
		const {
			data: { user }
		} = await this.$apollo.query({ query })

		if (user) this.$store.commit('setUser', user)
	},
	methods: {
		async logout() {
			this.$parent.$emit('loader', 'start')

			try {
				const {
					data: { _logout }
				} = await this.$apollo.mutate({
					mutation
				})

				if (_logout) this.$store.commit('logout')

				this.$parent.$emit('loader', 'done')
			} catch (error) {
				console.log(error)
			}
		}
	}
}
</script>

<style scoped>
section {
	border-bottom: 1px solid #ccc;
}
section > div {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	overflow: hidden;
	font-size: 13px;
	padding: 0 15px;
	height: 100%;
}
button {
	padding: 5px 10px;
}
</style>

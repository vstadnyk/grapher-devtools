<template>
	<section :class="error ? ' error' : ''" v-text="operation" />
</template>

<script>
import { PingToken, RefreshToken } from '../graphql/User.gql'

export default {
	name: 'Tray',
	data: () => ({
		error: null,
		operation: null
	}),
	methods: {
		ping() {
			this.error = null
			this.operation = 'Ping token...'

			this.$store.commit('isOnline', true)

			this.$api
				.query(PingToken)
				.then(({ ping }) => {
					console.log(this.operation, ping)

					this.operation = null
					this.error = null

					if (!ping) this.refresh()
				})
				.catch(error => {
					this.emitError(error)
				})
		},
		async refresh() {
			this.error = null
			this.operation = 'Refresh token...'

			this.$api
				.mutate({
					mutation: RefreshToken,
					variables: { token: this.$store.getters.refreshToken }
				})
				.then(({ data: { _refreshToken } }) => {
					console.log(this.operation, !!_refreshToken)

					this.operation = null

					this.$store.commit('refreshToken', _refreshToken)
				})
				.catch(error => {
					this.$store.commit('logout')

					this.emitError(error)
				})
		},
		emitError(error) {
			console.error(error)

			this.$store.commit('isOnline', error.type === 'CONNECTION_FAILED')

			this.error = true
			this.operation = error.type
		}
	}
}
</script>

<style scoped>
section {
	font-size: 12px;
	padding: 10px;
	border-top: 1px solid #ccc;
}
</style>

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
		ping(timer) {
			this.error = null
			this.operation = 'Ping token...'
			this.timer = timer

			this.$api
				.query(PingToken)
				.then(({ ping }) => {
					console.log(this.operation, ping)

					this.operation = null

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
					variables: { token: localStorage.getItem('RefreshToken') }
				})
				.then(({ data: { _refreshToken } }) => {
					console.log(this.operation, !!_refreshToken)

					this.operation = null

					this.$store.commit('RefreshToken', _refreshToken)
				})
				.catch(error => {
					this.$store.commit('logout')

					this.emitError(error)
				})
		},
		emitError(error) {
			console.error(error)

			this.error = true
			this.operation = error.type

			clearInterval(this.timer)
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

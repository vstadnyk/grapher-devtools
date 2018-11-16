<template>
	<section :class="error ? ' error' : ''" v-text="operation" />
</template>

<script>
import { PingToken, RefreshToken } from '../graphql/User.gql'
import Error from '../controllers/error'

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

			this.$apollo
				.query({
					query: PingToken,
					fetchPolicy: 'network-only'
				})
				.then(({ data: { ping } }) => {
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

			this.$apollo
				.mutate({
					mutation: RefreshToken,
					variables: { token: localStorage.getItem('refreshToken') }
				})
				.then(({ data: { _refreshToken } }) => {
					console.log(this.operation, !!_refreshToken)

					this.operation = null

					this.$store.commit('refreshToken', _refreshToken)
				})
				.catch(error => {
					this.$store.commit('logout')

					this.emitError(error)

					if (!error.networkError)
						console.error(Error.format(error, 'type'), Error.format(error))
				})
		},
		emitError(error) {
			if (!error.networkError) return

			console.error(error)

			this.error = true
			this.operation = Error.format(error)
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

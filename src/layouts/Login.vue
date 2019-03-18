<template>
	<section v-if="show">
		<form @submit.prevent="$emit('submit')">
			<h1>Authorization</h1>
			<p>
				<Input
					autofocus
					type="mail"
					name="mail"
					placeholder="Email"
					v-model="data.mail"
					required
				/>
			</p>
			<p>
				<Input
					type="password"
					name="pass"
					placeholder="Password"
					v-model="data.pass"
					required
				/>
			</p>
			<p v-if="error" v-text="error" :class="'status'.concat(!loading ? ' error' : '')" />
			<div>
				<span><img v-if="loading" src="loader.svg"/></span>
				<button class="btn hightlight" type="submit">Login</button>
			</div>
		</form>
	</section>
</template>

<script>
import controller from '../components/Form/controller'
import { user as config } from '../../config'
import { Login as mutation, PingToken, RefreshToken } from '../graphql/User.gql'
import { ServerInstance } from '../graphql/Info.gql'

export default {
	mixins: [controller],
	data: () => ({
		error: null,
		loading: null,
		interval: null,
		show: false,
		fields: {
			mail: {
				type: String,
				required: true
			},
			pass: {
				type: String,
				required: true
			}
		}
	}),
	computed: {
		$db() {
			return this.$parent.$db
		}
	},
	async created() {
		await this.ping()

		this.setInterval()

		this.$on('logout', async () => {
			this.show = true
			clearInterval(this.interval)
			this.$store.commit('logout')

			const { id } = await this.$db.user.get()

			await this.$db.user.remove(id)
		})
	},
	methods: {
		async sync() {
			this.show = false

			if (!this.$store.state.user) {
				const [user, rules] = await Promise.all([
					this.$db.user.get(),
					this.$db.userRules.get()
				])

				this.$store.commit('setUserRules', rules)
				this.$store.commit('login', user)
			}

			if (!this.$store.state.instance && this.$store.state.user) {
				try {
					const { serverInfo: { instance = null } = {} } =
						(await this.$graphql(ServerInstance)) || {}

					this.$store.commit('setInstance', instance)
				} catch (error) {
					console.error(error)
				}
			}

			this.show = !this.$store.state.user
		},
		setInterval() {
			clearInterval(this.interval)

			if (config.pingToken)
				this.interval = setInterval(() => {
					this.ping()
				}, config.pingToken)
		},
		async ping() {
			if (this.$store.getters.authToken()) {
				try {
					const { ping } = (await this.$graphql(PingToken)) || {}

					if (!ping) await this.refresh()
				} catch (error) {
					console.log(error)

					this.$emit('logout')
				}
			}
		},
		async refresh() {
			try {
				const { _refreshToken = {} } =
					(await this.$graphql(RefreshToken, {
						token: this.$store.getters.authToken('refreshToken') || ''
					})) || {}

				const { id } = this.$store.state.user

				await this.$db.user.put(Object.assign({ id }, _refreshToken))

				await this.sync()
			} catch (error) {
				throw error
			}
		},
		async submit({ input }) {
			this.loading = true
			this.error = null

			try {
				const { login } = await this.$graphql(mutation, input)

				if (login) {
					const {
						user: { id, mail, fullName, photo, permission: { rules = {} } } = {},
						tokens: { accessToken, refreshToken }
					} = login

					const user = {
						id,
						mail,
						fullName,
						photo,
						accessToken,
						refreshToken
					}

					await this.$db.user.put(user)

					const rulesList = Object.entries(rules || {}).map(([rule, value]) => ({
						rule,
						value
					}))

					await Promise.all(rulesList.map(rule => this.$db.userRules.put(rule)))

					await this.sync()

					if (this.$store.getters.userCan('dt-login')) {
						setTimeout(() => {
							this.setInterval()
						}, 100)
					} else {
						this.error = 'Permission denied'
						this.$emit('logout')
					}
				}
			} catch ({ message, type = '' }) {
				this.error = type.concat(': ', message)
			}

			this.loading = null
		}
	}
}
</script>

<style scoped>
section {
	height: 100vh;
	background: rgb(50, 54, 57);
	align-items: center;
	display: flex;
	justify-content: center;
}
form {
	background: white;
	padding: 20px;
	width: 280px;
}
div {
	display: flex;
	justify-content: space-between;
}
img {
	height: 28px;
}
input {
	width: 100%;
}
h1 {
	margin: 0;
	color: #444;
	text-align: center;
}
p.status {
	color: #444;
	margin: 0;
	margin-top: -10px;
	margin-bottom: 15px;
}
p.status.error {
	color: red;
}
</style>

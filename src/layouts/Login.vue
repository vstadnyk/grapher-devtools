<template>
	<section v-if="!isLogin">
		<p class="error" v-if="!isOnline">
			Server is offline
		</p>
		<form v-if="isOnline" @submit.prevent="login">
			<h1>Authorization</h1>
			<p>
				<input autofocus type="mail" name="mail" placeholder="Email" required>
			</p>
			<p>
				<input type="password" name="pass" placeholder="Password" required>
			</p>
			<p v-if="error" :class="'status'.concat(!loading ? ' error' : '')" v-text="error">
			<div align="right">
				<button class="btn hightlight" type="submit">Login</button>
			</div>
		</form>
	</section>
</template>

<script>
import { Login as mutation } from '../graphql/User.gql'
import Form from '../controllers/form'

export default {
	name: 'Login',
	data: () => ({
		error: null,
		loading: null
	}),
	computed: {
		isLogin() {
			return this.$store.state.isLogin
		},
		isOnline() {
			return this.$store.state.isOnline
		}
	},
	methods: {
		async login(e) {
			this.loading = true
			this.error = 'Loading...'

			try {
				const { _login } = await this.$api.mutate(mutation, Form.getData(e.target))

				if (_login) {
					const {
						user: {
							permission: { rules }
						}
					} = _login

					if (rules['devtools-login']) {
						this.$store.commit('login', _login)
						this.error = null
					} else {
						this.error = 'Permission denied'
					}
				}

				this.loading = null
			} catch (error) {
				this.loading = null

				this.error = error.type

				console.error(error)
			}
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

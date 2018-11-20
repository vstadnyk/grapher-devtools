<template>
	<section>
		<div v-if="error" v-text="error" class="error"/>
		<section>
			<div>
				<h2>Auth Info</h2>
				<div v-if="info" class="info">
					<Viewer :objectEntries="info"/>
				</div>
			</div>
			<div>
				<h2>Get token info</h2>
				<form @submit.prevent="submit" @reset="reset">
					<p>
						<input type="text" name="token" required>
					</p>
					<div v-if="tokenInfo">
						<Viewer :objectEntries="tokenInfo"/>
						<p>
							<button @click="getUser" class="btn hightlight">Get user</button>
						</p>
						<div v-if="userInfo">
							<Viewer :objectEntries="userInfo"/>
						</div>
					</div>
					<p align="right">
						<button type="reset" class="btn">Reset</button>
						<button class="btn hightlight">Submit</button>
					</p>
				</form>
			</div>
		</section>
	</section>
</template>

<script>
import { AuthInfo, AuthTokenInfo, AuthUser } from '../graphql/Info.gql'
import Error from '../controllers/error'
import Form from '../controllers/form'
import Viewer from '../components/ui/Viewer.vue'

export default {
	components: { Viewer },
	data: () => ({
		info: null,
		tokenInfo: null,
		userInfo: null,
		error: null
	}),
	async created() {
		this.error = null

		this.$parent.$emit('loader', 'start')

		try {
			const {
				data: {
					serverInfo: { JWT: info }
				}
			} = await this.$apollo.query({ query: AuthInfo })

			this.$parent.$emit('loader', 'done')

			this.info = Object.entries(info).filter(
				([key, value]) => key && typeof value === 'string'
			)
		} catch (error) {
			this.error = Error.format(error, 'type')

			this.$parent.$emit('loader', 'done')

			console.error(Error.format(error))
		}
	},
	methods: {
		async submit({ target: form }) {
			const variables = Form.getData(form)

			this.error = null
			this.tokenInfo = null

			this.$parent.$emit('loader', 'start')

			try {
				const {
					data: { tokenInfo }
				} = await this.$apollo.query({ query: AuthTokenInfo, variables })

				this.$parent.$emit('loader', 'done')

				if (!tokenInfo) this.error = 'Token not valid'
				if (tokenInfo) this.tokenInfo = Object.entries(tokenInfo)
			} catch (error) {
				this.$parent.$emit('loader', 'done')

				this.error = Error.format(error, 'type')

				console.error(Error.format(error))
			}
		},
		async getUser() {
			const { rid, mail } = Object.assign(
				{},
				...(this.tokenInfo || []).map(([k, v]) => ({ [k]: v }))
			)

			this.$parent.$emit('loader', 'start')

			try {
				const {
					data: { user }
				} = await this.$apollo.query({ query: AuthUser, variables: { mail, rid } })

				this.$parent.$emit('loader', 'done')

				if (user)
					this.userInfo = Object.entries(user).filter(([key]) => key !== '__typename')
			} catch (error) {
				this.$parent.$emit('loader', 'done')

				this.error = Error.format(error, 'type')

				console.error(Error.format(error))
			}
		},
		reset() {
			this.error = null
			this.tokenInfo = null
			this.userInfo = null
		}
	}
}
</script>

<style scoped>
section > section {
	display: grid;
	padding: 0 10px;
	grid-template-columns: [col] 250px [col] auto;
	grid-template-rows: auto;
}
input {
	width: 100%;
}
button[type='reset'] {
	margin: 0 15px;
}
</style>

<template>
	<section>
		<div v-if="error" v-text="error" class="error"/>
		<section>
			<div>
				<div v-if="info" class="info">
					<Viewer :objectEntries="info"/>
				</div>
			</div>
			<div>
				<form @submit.prevent="submit" @reset="reset">
					<input type="text" name="token" required placeholder="AccessToken">
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
import { AuthInfo, AuthTokenInfo, AuthUser } from '../../graphql/User.gql'
import Form from '../../controllers/form'
import Viewer from '../../components/Viewer.vue'

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
				serverInfo: { JWT: info }
			} = await this.$api.query(AuthInfo)

			this.$parent.$emit('loader', 'done')

			this.info = Object.entries(info).filter(
				([key, value]) => key && typeof value === 'string'
			)
		} catch (error) {
			this.error = error.type

			this.$parent.$emit('loader', 'done')

			console.error(error)
		}
	},
	methods: {
		async submit({ target: form }) {
			this.error = null
			this.tokenInfo = null

			this.$parent.$emit('loader', 'start')

			try {
				const { tokenInfo } = await this.$api.query(AuthTokenInfo, Form.getData(form))

				this.$parent.$emit('loader', 'done')

				if (!tokenInfo) this.error = 'Token not valid'
				if (tokenInfo) this.tokenInfo = Object.entries(tokenInfo)
			} catch (error) {
				this.$parent.$emit('loader', 'done')

				this.error = error.type

				console.error(error)
			}
		},
		async getUser() {
			const { rid, mail } = Object.assign(
				{},
				...(this.tokenInfo || []).map(([k, v]) => ({ [k]: v }))
			)

			this.$parent.$emit('loader', 'start')

			try {
				const { user } = await this.$api.query(AuthUser, { mail, rid })

				this.$parent.$emit('loader', 'done')

				if (user)
					this.userInfo = Object.entries(user).filter(([key]) => key !== '__typename')
			} catch (error) {
				this.$parent.$emit('loader', 'done')

				this.error = error.type

				console.error(error)
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
	grid-template-columns: [col] 250px [col] auto;
	grid-template-rows: auto;
}
input {
	margin-top: 5px;
	width: 100%;
}
button[type='reset'] {
	margin: 0 15px;
}
</style>

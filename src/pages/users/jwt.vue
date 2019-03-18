<template>
	<section>
		<div>
			<div class="info">
				<h2>JWT config</h2>
				<viewer v-bind="viewerInfo" />
			</div>
		</div>
		<div>
			<h2>Get token information</h2>
			<form @submit.prevent="$emit('submit')" @reset="viewerToken.data = {}">
				<Input name="token" v-model="data.token" :required="true" placeholder="Token" />

				<div v-if="Object.keys(viewerToken.data).length" class="viewerToken">
					<viewer v-bind="viewerToken" />
				</div>

				<p align="right">
					<button type="reset" class="btn">Reset</button>
					<button class="btn hightlight">Submit</button>
				</p>
			</form>
		</div>
	</section>
</template>

<script>
import { AuthInfo } from '../../graphql/User.gql'
import Viewer from '../../components/Viewer.vue'

import controller from '../../components/Form/controller'

export default {
	mixins: [controller],
	components: { Viewer },
	data: () => ({
		viewerToken: {
			data: {},
			filter: (key, value) => value !== null && !['rid', 'mail'].find(row => key === row),
			options: { backLink: false, scoped: false, border: true, readOnly: true },
			fieldHooks: {
				id(key, id) {
					return {
						View: window.location.origin.concat(
							this.$router.resolve({
								name: 'viewUser',
								params: { id }
							}).href
						)
					}
				},
				user(key, value) {
					return { Exists: !!value }
				},
				type(key, value) {
					return { 'Token type': value }
				},
				generated(key, value) {
					return { Date: value }
				},
				die(key, value) {
					return { 'Fade through': value }
				}
			}
		},
		viewerInfo: {
			query: AuthInfo,
			options: { backLink: false, scoped: false },
			filter: (key, value) => key && typeof value === 'string',
			dataHook: ({ JWT = {} } = {}) => JWT,
			fieldHooks: {
				accessTokenExp(key, value) {
					return { 'Access token live': value }
				},
				refreshTokenExp(key, value) {
					return { 'Refresh token live': value }
				},
				headerKey(key, value) {
					return { 'Header key': value }
				}
			}
		},
		fields: {
			token: {
				type: String,
				required: true
			}
		}
	}),
	methods: {
		async submit({ input: { token } }) {
			this.viewerToken.data = await this.$user.getByToken(token)
		}
	}
}
</script>

<style scoped>
section {
	display: grid;
	grid-template-columns: [col] 250px [col] auto;
	grid-template-rows: auto;
}
input {
	width: 100%;
}
button[type='reset'] {
	margin: 0 15px;
}
.viewerToken {
	margin-top: -1px;
}
</style>

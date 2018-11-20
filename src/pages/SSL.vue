<template>
	<section>
		<div v-if="error" v-text="error" class="error"/>
		<form v-if="info" @submit.prevent="submit" @reset.prevent="reset">
			<div>
				<label for="key">Private key:</label>
				<label for="cert">Certificate:</label>
			</div>
			<div>
				<textarea id="key" v-model="key"></textarea>
				<textarea id="cert" v-model="cert"></textarea>
			</div>
			<p v-if="key !== info.key || cert !== info.cert" align="right">
				<button class="btn" type="reset">Reset</button>
				<button class="btn hightlight">Save</button>
			</p>
		</form>
	</section>
</template>

<script>
import { SSL as query } from '../graphql/Info.gql'
import Error from '../controllers/error'

export default {
	data: () => ({
		info: null,
		error: null,
		key: null,
		cert: null
	}),
	async created() {
		this.$parent.$emit('loader', 'start')

		this.error = null

		try {
			const {
				data: {
					serverInfo: { ssl: info }
				}
			} = await this.$apollo.query({ query })

			this.$parent.$emit('loader', 'done')

			this.info = info
			this.key = info.key
			this.cert = info.cert
		} catch (error) {
			this.$parent.$emit('loader', 'done')

			this.error = Error.format(error, 'type')

			console.error(Error.format(error))
		}
	},
	methods: {
		async submit() {
			this.$parent.$emit('loader', 'start')
			// const { key, cert } = this
		},
		reset() {
			this.key = this.info.key
			this.cert = this.info.cert
		}
	}
}
</script>

<style scoped>
form {
	padding: 0 15px;
}
form div {
	display: grid;
	grid-template-columns: [col] 50% [col] 50%;
	grid-template-rows: auto;
}
textarea {
	width: 100%;
	max-width: calc(100% - 16px);
	resize: none;
	overflow: auto;
	height: 370px;
	padding: 7px;
	border: 1px solid #ccc;
}
label {
	padding-bottom: 10px;
}
button[type='reset'] {
	margin-right: 15px;
}
</style>

<template>
	<form @submit.prevent="$emit('submit')">
		<top />
		<header>
			<Select
				label="Event"
				name="event"
				:options="$parent.$parent.events"
				:append-empty="false"
				v-model="data.event"
			/>
			<Select
				label="App"
				name="app"
				:options="$parent.$parent.apps"
				:append-empty="false"
				v-model="data.app"
			/>
			<Select
				label="Platform"
				name="platform"
				:options="$parent.$parent.platforms"
				:append-empty="false"
				v-model="data.platform"
			/>
			<Select
				label="Language"
				name="lang"
				:options="$store.getters.langs"
				:append-empty="false"
				v-model="data.lang"
			/>
		</header>
		<section>
			<div>
				<p><Input label="User" name="user" required v-model="data.user" /></p>
			</div>
			<div>
				<p><Textarea label="Token" name="token" required v-model="data.token" /></p>
				<p>
					<button type="button" class="btn hightlight" @click="getToken">
						Get token
					</button>
				</p>
			</div>
		</section>
		<bottom :hide="['active']" />
	</form>
</template>

<script>
import controller from '../../../components/Form/controller'
import Firebase from '../../../controllers/firebase'

import { Subscribe as mutation } from '../../../graphql/Push.gql'

export default {
	mixins: [controller],
	data: () => ({
		fields: {
			user: {
				type: Number,
				required: null
			},
			token: {
				type: String,
				required: true,
				default: null
			},
			event: {
				type: String,
				required: true
			},
			app: {
				type: String,
				required: true
			},
			platform: {
				type: String,
				required: true
			}
		}
	}),
	computed: {
		locales() {
			return this.$store.getters.langs
		},
		firebase() {
			return new Firebase().use(this.$root.$app)
		}
	},
	methods: {
		async getToken() {
			const token = await this.firebase.getToken()
			this.data.token = token
		},
		submit({ input }) {
			const { event } = input

			delete input.event // eslint-disable-line

			this.$save(mutation, {
				input: {
					...input,
					events: [event]
				}
			})
		}
	},
	async created() {
		const { id: user } = this.$store.state.user || {}
		const token = await this.firebase.getToken()

		this.data = { user, token }
	}
}
</script>

<style scoped>
header {
	margin: 10px 0;
	display: flex;
	justify-content: space-between;
}
header > * {
	width: calc(25% - 10px);
}
section {
	margin: 0 -5px;
	display: grid;
	grid-template-columns: [col] 350px [col] auto;
	grid-template-rows: auto;
}
section > * {
	padding: 0 5px;
}
</style>

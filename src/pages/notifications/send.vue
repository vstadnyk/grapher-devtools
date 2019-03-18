<template>
	<form @submit.prevent="$emit('submit')">
		<div class="grid">
			<div>
				<h2>Event</h2>
				<Select
					v-model="data.event"
					name="event"
					:options="$parent.events"
					:appendEmpty="false"
				/>
				<p><Select label="App" v-model="data.app" name="app" :options="$parent.apps" /></p>
				<p>
					<Select
						label="Platform"
						name="platform"
						v-model="data.platform"
						:options="$store.getters.appplatforms"
					/>
				</p>
				<p>
					<Select
						v-model="data.lang"
						label="Language"
						name="lang"
						:options="$store.getters.langs"
					/>
				</p>
				<p><button type="submit" class="btn hightlight">Send</button></p>
			</div>
			<div>
				<h2>Variables</h2>
				<json
					v-model="data.json"
					:editable="true"
					:protected-fields="['users', 'vars', 'data']"
				/>
			</div>
			<div>
				<h2>Console</h2>
				<console ref="console" v-model="error" />
			</div>
		</div>
	</form>
</template>

<script>
import Json from 'grapher-json-ui'
import 'grapher-json-ui/dist/index.css'

import Console from '../../components/Console.vue'

import { PushTemplatesCount, PushSubscribersCount, Send as mutation } from '../../graphql/Push.gql'

import Firebase from '../../controllers/firebase'
import controller from '../../components/Form/controller'

export default {
	mixins: [controller],
	components: { Json, Console },
	data: () => ({
		error: 0,
		fields: {
			event: {
				type: String
			},
			app: {
				type: String,
				validation: false
			},
			platform: {
				type: String,
				validation: false
			},
			lang: {
				type: String
			},
			json: {
				type: Object
			}
		}
	}),
	created() {
		this.data = { json: { users: this.$route.query.user || [], vars: {}, data: {} } }
	},
	computed: {
		users() {
			return (this.$route.query.user || []).map(row => parseInt(row, 0)) || []
		},
		console() {
			return this.$refs.console
		}
	},
	methods: {
		formatError({ message, type, dump }) {
			return Object.assign(new Error(), { message, type, dump })
		},
		async templatesCheck({ event, app, platform }) {
			if (this.error) return false

			this.console.log('templates check...')

			try {
				const { templates } =
					(await this.$graphql(PushTemplatesCount, {
						input: { event, app, platform, active: true }
					})) || {}

				if (!templates)
					throw this.formatError({
						type: 'VALIDATION_ERROR',
						message: 'templates not found',
						dump: { event, app, platform }
					})

				this.console.success(`found ${templates.count} templates`)
			} catch (error) {
				this.console.error(error.message)

				throw error
			}

			return true
		},
		async subscribersCheck(where) {
			const { event, app, platform, users, lang } = where

			if (this.error) return false

			const input = { event, app, platform, lang, active: true }

			if (Array.isArray(users) && users.length) {
				this.console.log(`check subscribe for users [${users.join(', ')}]...`)
				Object.assign(input, { user: users })
			} else {
				this.console.log(`check subscribes...`)
			}

			try {
				const { subscribers } = (await this.$graphql(PushSubscribersCount, { input })) || {}

				if (!subscribers)
					throw this.formatError({
						type: 'VALIDATION_ERROR',
						message: 'subscribers not found',
						dump: { event, app, platform, lang, users }
					})

				this.console.success(`found ${subscribers.count} subscription`)

				Object.assign(where, {
					users: subscribers.rows.map(({ user }) => user)
				})
			} catch (error) {
				this.console.error(error.message)

				throw error
			}

			return true
		},
		async push(where) {
			if (this.error) return false

			this.console.log('send notification...')

			const { event, users, vars, data } = where
			const input = { event, vars, data }

			if (Array.isArray(users) && users.length) Object.assign(input, { users })

			try {
				const { sent } = await this.$graphql(mutation, input)

				if (!sent)
					throw this.formatError({
						type: 'SEND_ERROR',
						message: 'notification not sent',
						dump: input
					})

				if (Array.isArray(users) && users.length) {
					this.console.success(`sent for users "[${input.users.join(' ,')}]"`)
				} else {
					this.console.success(`sent successful`)
				}

				this.$root.$app.$emit('success', { message: 'Message sent', redirect: false })
			} catch (error) {
				this.console.error(error.message)

				throw error
			}

			return true
		},
		async listen() {
			if (this.error) return false

			this.console.log('init firebase...')

			const firebase = new Firebase()

			await firebase.init()

			this.console.success('firebase inited')

			if (!this.firebaseHandler)
				firebase.messaging.onMessage(payload => {
					this.console.success(
						'recive message: '.concat(JSON.stringify(payload, null, '\n'))
					)

					const {
						notification: { title, body }
					} = payload

					this.firebaseHandler = { title, body }

					new Notification(title, { body }) // eslint-disable-line
				})

			return true
		},
		async submit({ input: { event, app, platform, lang, json: { users, vars, data } = {} } }) {
			this.console.reset()
			this.error = 0

			const where = { event, vars, data, users, active: true }

			if (app) Object.assign(where, { app: [app] })
			if (lang) Object.assign(where, { lang: [lang] })
			if (platform) Object.assign(where, { platform: [platform] })

			try {
				await this.listen()

				await this.templatesCheck(where)
				await this.subscribersCheck(where)

				await this.push(where)
			} catch (error) {
				this.$root.$app.$emit('error', error)
			}
		}
	}
}
</script>

<style scoped>
form > div {
	display: grid;
	grid-template-columns: [col] 250px [col] 350px [col] auto;
	grid-template-rows: auto;
	margin: 0 -7px;
}
form > div > div {
	padding: 0 7px;
}
</style>

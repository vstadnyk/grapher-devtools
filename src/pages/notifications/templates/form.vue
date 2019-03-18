<template>
	<form @submit.prevent="$emit('submit')">
		<top :id="id" />
		<header>
			<Select
				label="Event"
				name="event"
				v-model="data.event"
				:options="config.events"
				:append-empty="false"
				:disabled="!!data.id"
			/>
			<Select
				label="App"
				name="app"
				v-model="data.app"
				:options="config.apptype"
				:append-empty="false"
				:disabled="!!data.id"
			/>
			<Select
				label="Platform"
				name="platform"
				v-model="data.platform"
				:options="config.appplatform"
				:append-empty="false"
				:disabled="!!data.id"
			/>
		</header>

		<div align="right"><locales v-model="lang" /></div>
		<p><Input label="Title" name="title" :lang="lang" v-model="data.title" required /></p>
		<p><Textarea label="Body" name="body" :lang="lang" v-model="data.body" required /></p>

		<bottom v-model="data.active" />
	</form>
</template>

<script>
import controller, { I18n } from '../../../components/Form/controller'

import {
	PushTemplate as query,
	AddPushTemplate as add,
	EditPushTemplate as edit
} from '../../../graphql/Push.gql'

export default {
	mixins: [controller],
	data: () => ({
		query,
		fields: {
			title: {
				type: I18n,
				default: null
			},
			body: {
				type: I18n,
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
			},
			active: {
				type: Boolean,
				default: true
			}
		}
	}),
	computed: {
		config() {
			return this.$store.state.pushTemplateData || {}
		},
		where() {
			return this.id ? { input: { id: this.id } } : null
		}
	},
	methods: {
		submit(data) {
			this.$save(this.id ? edit : add, data, 'Template saved')
		}
	}
}
</script>

<style scoped>
header {
	margin: 10px 0;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 15px;
}
div[align] {
	padding-top: 15px;
	margin-bottom: -20px;
}
</style>

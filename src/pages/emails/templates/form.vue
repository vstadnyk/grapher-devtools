<template>
	<form @submit.prevent="$emit('submit')">
		<top :id="id" />

		<div>
			<Select
				label="Alias"
				name="alias"
				:options="$parent.$parent.aliases"
				v-model="data.alias"
				:disabled="!!data.id"
			/>
			<p><locales v-model="lang" /></p>
		</div>
		<p><Input label="Subject" name="subject" :lang="lang" v-model="data.subject" required /></p>
		<p>
			<Textarea label="Message" name="message" :lang="lang" v-model="data.message" required />
		</p>

		<bottom v-model="data.active" />
	</form>
</template>

<script>
import controller, { I18n } from '../../../components/Form/controller'

import {
	MailTemplate as query,
	AddMailTemplate as add,
	EditMailTemplate as edit
} from '../../../graphql/Mail.gql'

export default {
	mixins: [controller],
	data: () => ({
		query,
		fields: {
			subject: {
				type: I18n,
				default: null
			},
			message: {
				type: I18n,
				default: null
			},
			alias: {
				type: String,
				required: true
			},
			active: {
				type: Boolean
			}
		}
	}),
	computed: {
		where() {
			return this.id ? { input: { id: this.id } } : null
		}
	},
	methods: {
		submit({ input, id }) {
			this.$save(id ? edit : add, { input, id }, 'Template saved')
		}
	}
}
</script>

<style scoped>
p {
	margin: 0;
	margin-bottom: 10px;
}
div {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}
</style>

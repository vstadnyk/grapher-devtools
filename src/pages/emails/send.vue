<template>
	<form @submit.prevent="$emit('submit')">
		<div class="grid">
			<div>
				<header>
					<p>
						<Select
							label="Template"
							style="display: inline-block;"
							:options="$parent.aliases"
							v-model="template"
						/>
						<template v-if="data.id">
							ID# {{ data.id }}
						</template>
					</p>
					<locales v-model="lang" />
				</header>
				<p><Input label="Subject" :value="data.subject" :lang="lang" /></p>
				<div v-if="previewTemplate" v-html="previewTemplate" />
				<p v-else><Textarea label="Message" v-model="data.message" :lang="lang" /></p>
				<p class="flex">
					<button class="btn" type="bottom" @click.prevent="renderTemplate">
						Render
					</button>
					<button class="btn hightlight" type="submit">Send</button>
				</p>
			</div>
			<div>
				<p align="right">
					<button
						class="btn"
						@click.prevent="previewJson = !previewJson"
						v-text="!previewJson ? 'View' : 'Edit'"
					/>
				</p>
				<label>To:</label>
				<json
					style="margin: 10px 0; border: 1px solid #ccc;"
					v-model="data.params.to"
					:editable="!previewJson"
				/>
				<label>From:</label>
				<json
					style="margin: 10px 0; border: 1px solid #ccc;"
					v-model="data.params.from"
					:editable="!previewJson"
					:add-new="false"
					:protected-fields="['name', 'mail']"
				/>
				<label>Variables:</label>
				<json
					style="margin: 10px 0; border: 1px solid #ccc;"
					v-model="data.params.variables"
					:editable="!previewJson"
				/>
			</div>
		</div>
		<label>Console:</label> <console ref="console" style="height: 200px;" />
	</form>
</template>

<script>
import Json from 'grapher-json-ui'
import 'grapher-json-ui/dist/index.css'

import controller from '../../components/Form/controller'

import {
	MailTemplateByAliasShort as query
	// SendMail as mutation
} from '../../graphql/Mail.gql'

// import Html from '../../controllers/html'
import Console from '../../components/Console.vue'

export default {
	mixins: [controller],
	data: () => ({ previewJson: false, previewTemplate: false }),
	components: { Json, Console },
	computed: {
		template: {
			get() {
				return this.data.alias
			},
			async set(alias) {
				const template = await this.getTemplate(alias)

				this.data = template
			}
		},
		console() {
			return this.$refs.console
		}
	},
	created() {
		this.data = {
			params: {
				to: [
					{
						name: '',
						mail: ''
					}
				],
				from: { name: '', mail: '' },
				variables: {}
			}
		}
	},
	methods: {
		submit() {
			this.validate()
		},
		async getTemplate(alias) {
			if (this.error) return {}

			if (!alias) {
				this.console.log(`alias not selected`)

				return {}
			}

			this.console.log(`get template "${alias}"...`)

			const { template } = (await this.$graphql(query, { alias })) || {}

			if (!template) {
				this.console.error(`template "${alias}" not found`)

				return {}
			}

			this.console.success(`template ${alias} loaded`)

			return template
		},
		renderTemplate() {
			/* const { message = [], params: { variables = {} } = {} } = this.data

			const { value = '' } = message.find(({ lang }) => lang === this.lang) */
			// const html = Html.stringToHtml(value, variables)
			// console.log(html, variables)
			// this.previewTemplate = Html.htmlToString(html)
		}
	}
}
</script>

<style scoped>
.grid {
	display: grid;
	grid-template-columns: [col] auto [col] 40%;
	grid-column-gap: 10px;
	margin-bottom: 20px;
}
p {
	margin: 10px 0;
}
header {
	display: grid;
	grid-template-columns: [col] auto [col] 115px;
}
.flex {
	display: flex;
	justify-content: space-between;
}
</style>

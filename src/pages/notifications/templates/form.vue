<template>
	<section>
		<p>
			<BackLink />
		</p>
		<hr>
		<form @submit.prevent="save">
			<div class="top">
				<span>{{ id ? `ID# ${id}` : null }}</span>
				<FormButtons />
			</div>
			<header>
				<span v-if="events">
					<Input
						label="Event"
						name="event"
						id="events"
						:value="getValue('event')"
						:datalist="events"
						:required="true"
					/>
				</span>
				<span v-if="apptype">
					<Input
						label="App"
						name="app"
						id="apptype"
						:value="getValue('app')"
						:datalist="apptype"
						:required="true"
					/>
				</span>
				<span v-if="appplatform">
					<Input
						label="Platform"
						name="platform"
						id="appplatform"
						:value="getValue('platform')"
						:datalist="appplatform"
						:required="true"
					/>
				</span>
			</header>
			<LocaleSwitcher />
			<div v-for="lang in locales" :key="lang">
				<div v-show="lang === currentLang">
					<p>
						<Input
							label="Title"
							name="title"
							:lang="lang"
							:value="getValue('title', lang)"
							:required="true"
						/>
					</p>
					<p>
						<Textarea
							label="Body"
							name="body"
							:lang="lang"
							:value="getValue('body', lang)"
							:required="true"
						/>
					</p>
				</div>
			</div>
			<div class="top">
				<Activator
					label="Active"
					name="active"
					:value="getValue('active')"
				/>
				<FormButtons />
			</div>
		</form>
	</section>
</template>

<script>
import BackLink from '../../../components/BackLink.vue'
import LocaleSwitcher from '../../../components/ui/LocaleSwitcher.vue'
import FormButtons from '../../../components/ui/FormButtons.vue'
import Input from '../../../components/ui/elements/Input.vue'
import Textarea from '../../../components/ui/elements/Textarea.vue'
import Activator from '../../../components/ui/elements/Activator.vue'
import Form from '../../../controllers/form'

import {
	PushData,
	PushTemplate,
	AddPushTemplate,
	EditPushTemplate
} from '../../../graphql/Push.gql'

export default {
	components: { BackLink, LocaleSwitcher, FormButtons, Input, Textarea, Activator },
	data: () => ({
		currentLang: null,
		events: null,
		apptype: null,
		appplatform: null,
		id: null,
		item: null
	}),
	computed: {
		locales() {
			const { active = [] } = this.$store.state.serverLocales || {}

			return active
		}
	},
	watch: {
		id() {
			this.getItem()
		}
	},
	async created() {
		this.$on('localeChange', lang => {
			this.currentLang = lang
		})

		if (!this.$store.state.pushTemplateData) {
			this.$root.$app.$emit('loader', 'start')

			try {
				const { pushTemplateData } = await this.$api.query(PushData)

				this.$root.$app.$emit('loader', 'done')

				this.$store.commit('setPushTemplateData', pushTemplateData)
			} catch (error) {
				this.$parent.$emit('error', error)
			}
		}

		if (this.$store.state.pushTemplateData)
			Object.entries(this.$store.state.pushTemplateData).forEach(([key, value]) => {
				this[key] = Form.arrayToObject(value)
			})

		const { id = null } = this.$route.params

		this.id = id
	},
	methods: {
		async getItem() {
			const { id } = this

			this.$root.$app.$emit('loader', 'start')

			try {
				const { pushTemplate_i18n: item = null } = await this.$api.query(PushTemplate, {
					input: { id }
				})

				this.$root.$app.$emit('loader', 'done')

				this.item = item
			} catch (error) {
				this.$parent.$emit('error', error)
			}
		},
		async save({ target: form }) {
			this.$root.$app.$emit('loader', 'start')

			const input = Form.getData(form)

			const { id } = this

			try {
				const { _addPushTemplate = null, _editPushTemplate = null } =
					(await this.$api.mutate(id ? EditPushTemplate : AddPushTemplate, {
						id,
						input
					})) || {}

				this.$root.$app.$emit('loader', 'done')

				if (_addPushTemplate) this.success('add')
				if (_editPushTemplate) this.success('edit')
			} catch (error) {
				this.$parent.$emit('error', error)
			}
		},
		success(operation) {
			const { matched } = this.$route

			this.$router.push(matched[matched.length - 2])

			this.$parent.$emit('success', operation)
		},
		getValue(field, lng) {
			if (!this.item) return null
			if (!Array.isArray(this.item[field])) return this.item[field] || null

			const { value = null } = (this.item[field] || []).find(({ lang } = {}) => lang === lng)

			return value
		}
	}
}
</script>

<style scoped>
section {
	overflow: hidden;
}
p {
	margin: 0;
	margin-bottom: 10px;
}
form > div {
	margin: 5px 0;
}
form > div.top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
header {
	margin: 10px 0;
	display: flex;
	justify-content: space-between;
}
header span {
	display: inline-block;
	width: 32%;
}
</style>

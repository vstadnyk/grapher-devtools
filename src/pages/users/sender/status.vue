<template>
	<form v-if="tmpls.find(row => row === tmpl) && !error" @submit.prevent="submit">
		<h2>{{ status ? 'Disable' : 'Enable' }} user with ID "{{ id }}"?</h2>

		<p v-if="exist"><b>Template: </b>{{ tmpl }}</p>
		<p class="error" v-if="!exist">Template "{{ tmpl }}" not found</p>

		<p v-if="!custom && exist">
			<Select
				label="Language"
				name="lang"
				:value="$store.getters.lang"
				:options="$store.getters.langs"
				:appendEmpty="false"
			/>
		</p>

		<p>
			<label>Send custom:<input type="checkbox" v-model="$parent.showTmpl"/></label>
		</p>
		<p v-if="exist && !custom"><button class="btn hightlight">Send</button></p>
	</form>
</template>

<script>
// import { EditUserStatus } from '../../../graphql/User.gql'
import Select from '../../../components/Elements/Select.vue'

export default {
	components: { Select },
	data: () => ({
		error: null,
		isCustom: null,
		tmpls: ['disable_user', 'enable_user']
	}),
	props: {
		tmpl: String,
		exist: Boolean,
		id: [String, Number]
	},
	computed: {
		status() {
			return this.tmpl === 'disable_user'
		},
		custom() {
			return this.$parent.showTmpl
		}
	},
	async created() {
		await this.$user.can('users-edit-status')

		/* this.$parent.$on('send', data => {
			this.submit({}, data)
		}) */
	},
	methods: {
		/* async submit({ target = null } = {}, { subject, message } = {}) {
			const { id, status } = this
			const { reason = null, lang = null } = this.$api.$form.getData(target)

			const data = { id, status: !status, lang, subject, message }

			if (reason)
				Object.assign(data, {
					vars: JSON.stringify({ reason })
				})

			this.$root.$app.$emit('loader', 'start')

			try {
				await this.$api.mutate(EditUserStatus, objectFilter(data))

				this.$root.$app.$emit('success', `User ${status ? 'disabled' : 'activated'}`)
			} catch (error) {
				this.$root.$app.$emit('error', error)
			}
		} */
	}
}
</script>

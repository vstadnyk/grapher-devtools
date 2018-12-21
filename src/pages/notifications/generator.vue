<template>
	<button @click="click" class="btn hightlight">Auto generate templates</button>
</template>

<script>
import { PushAutoTemplates, AddPushTemplate } from '../../graphql/Push.gql'

export default {
	data: () => ({
		rows: []
	}),
	methods: {
		async click() {
			await this.getAllTemplates()

			const { serverLocales: { active: langs = [] } = {} } = this.$store.state || {}

			const inputs = []

			const {
				pushTemplateData: { eventsPack = {}, appplatform = [] } = {}
			} = this.$store.state

			appplatform.forEach(platform => {
				Object.entries(eventsPack).forEach(([app, events]) => {
					events.forEach(event => {
						if (
							!this.rows.find(
								row =>
									row.platform === platform &&
									row.app === app &&
									row.event === event
							)
						)
							inputs.push({
								platform,
								app,
								event,
								title: langs.map(lang => ({
									lang,
									value: `Auto title for event "${event}" ${lang}`
								})),
								body: langs.map(lang => ({
									lang,
									value: `Auto body for event "${event}" ${lang}`
								}))
							})
					})
				})
			})

			this.$root.$app.$emit('loader', 'start')

			try {
				await Promise.all(inputs.map(input => this.$api.mutate(AddPushTemplate, { input })))

				this.$root.$app.$emit('loader', 'done')
			} catch (error) {
				this.$parent.$parent.$emit('error', error)
			}
		},
		async getAllTemplates() {
			this.$root.$app.$emit('loader', 'start')

			try {
				const { pushTemplates } = (await this.$api.query(PushAutoTemplates)) || {}

				this.rows = this.rows.concat((pushTemplates || {}).rows || [])

				this.$root.$app.$emit('loader', 'done')
			} catch (error) {
				this.$parent.$parent.$emit('error', error)
			}
		}
	},
	async created() {
		if (!this.$store.state.pushTemplateData) await this.$parent.$parent.getData()
	}
}
</script>

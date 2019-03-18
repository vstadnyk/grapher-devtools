<template>
	<article>
		<section>
			<h2>Not existing templates</h2>
			<Table ref="table" v-bind="table" v-model="selected" />
		</section>
	</article>
</template>

<script>
import Table from '../../components/Table/index.vue'

import {
	PushTemplatesByEventExist as query,
	AddPushTemplate as mutation
} from '../../graphql/Push.gql'

import api from '../../controllers/api'

export default {
	mixins: [api],
	components: { Table },
	data: () => ({
		selected: [],
		table: {
			query,
			fields: {
				event: {
					name: 'Event'
				},
				app: {
					name: 'App'
				},
				platform: {
					name: 'Platform'
				}
			},
			options: {
				limitStep: 0,
				showCheckboxes: true
			},
			actions: {
				generate: {
					text: 'Generate selected',
					class: 'hightlight',
					position: 'bottom',
					click() {
						if (window.confirm('Generate selected templates?')) this.generate()
					}
				}
			},
			dataHook({ rows: exists = [] }) {
				const rows = this.list.filter(
					({ event, app, platform }) =>
						!exists.find(
							row =>
								row.event === event && row.app === app && row.platform === platform
						)
				)

				return { rows, count: rows.length }
			}
		}
	}),
	computed: {
		config() {
			return this.$store.state.pushTemplateData || {}
		},
		eventsPack() {
			return this.config.eventsPack || {}
		},
		appsOnPlatfroms() {
			return this.config.appsOnPlatfroms || {}
		},
		list() {
			const all = []

			Object.entries(this.appsOnPlatfroms).forEach(([platform, apptypes]) => {
				apptypes.forEach(app => {
					;(this.eventsPack[app] || []).forEach(event => {
						all.push({ id: event.concat(app, platform), event, app, platform })
					})
				})
			})

			return all
		},
		formated() {
			const { langs = [] } = this.$store.getters

			return this.list
				.filter(({ id }) => this.selected.find(row => row === id))
				.map(row => {
					delete row.id // eslint-disable-line

					return Object.assign({}, row, {
						title: langs.map(lang => ({
							lang,
							value: `Auto title for event ${row.event} ${lang}`
						})),
						body: langs.map(lang => ({
							lang,
							value: `Auto body for event ${row.event} ${lang}`
						}))
					})
				})
		}
	},
	methods: {
		async generate() {
			await Promise.all(this.formated.map(input => this.$query(mutation, { input })))

			this.$root.$app.$emit('success', {
				message: 'Templates generated',
				reset: 5000,
				redirect: 1,
				onRedirect: () => {
					this.selected = []

					this.$refs.table.$emit('reset')
					this.$refs.table.$emit('refetch', 0)

					return true
				}
			})
		}
	}
}
</script>

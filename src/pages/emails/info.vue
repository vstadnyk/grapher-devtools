<template>
	<article>
		<section>
			<h2>Not existing templates</h2>
			<Table ref="table" v-bind="table" v-model="selected" />
		</section>
	</article>
</template>

<script>
import api from '../../controllers/api'
import Table from '../../components/Table/index.vue'
import { MailTemplatesExist as query, AddMailTemplate as mutation } from '../../graphql/Mail.gql'

export default {
	mixins: [api],
	components: { Table },
	data: () => ({
		selected: [],
		table: {
			query,
			fields: {
				id: {
					name: 'Alias'
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
				const rows = this.aliases
					.filter(alias => !exists.find(row => row.alias === alias))
					.map(id => ({ id }))

				return { rows, count: rows.length }
			}
		}
	}),
	computed: {
		config() {
			return this.$store.state.mailConfig || {}
		},
		aliases() {
			const { template: { aliases = [] } = {} } = this.config

			return aliases
		},
		systemFrom() {
			const { systemMail: mail, default: defaultFrom = {} } = this.config

			return Object.assign({}, defaultFrom, { mail })
		},
		from() {
			if (!this.systemFrom) return null

			const { mail, from: { name = null } = {} } = this.systemFrom

			return { mail, name }
		},
		formated() {
			const { langs } = this.$store.getters

			return this.selected.map(alias => ({
				alias,
				subject: langs.map(lang => ({
					lang,
					value: `Auto subject for "${alias}" ${lang}`
				})),
				message: langs.map(lang => ({
					lang,
					value: `Auto message for "${alias}" ${lang}`
				}))
			}))
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

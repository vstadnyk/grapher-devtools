<template>
	<article>
		<div>
			<h2>Active dictionaries</h2>
			<div>
				<Table
					v-if="data"
					ref="table"
					v-model="selected"
					v-bind="{ data, fields, options, actions }"
				/>
			</div>
		</div>
		<div>
			<h2>Config</h2>
			<viewer :data="config" :options="{ border: true, backLink: false }" />
		</div>
	</article>
</template>

<script>
import Table from '../../../components/Table/index.vue'
import Viewer from '../../../components/Viewer.vue'
import api from '../../../controllers/api'

import { GetLocales, ModifyLocale } from '../../../graphql/Locale.gql'

export default {
	mixins: [api],
	components: { Table, Viewer },
	data: () => ({
		selected: [],
		fields: {
			id: {
				name: 'Code',
				link: { name: 'viewLexicon' }
			},
			def: {
				name: 'Default',
				width: '1'
			}
		},
		options: {
			limitStep: 0,
			showCheckboxes: true
		},
		actions: {
			view: {
				href: { name: 'viewLexicon' }
			},
			edit: {
				href: { name: 'editLexicon' }
			},
			balance: {
				text: 'Balance selected',
				class: 'hightlight',
				position: 'bottom',
				select({ selected = [] }) {
					return selected.length === this.data.count
				},
				click() {
					if (window.confirm('Balance selected dictionaries?')) this.balance()
				}
			}
		}
	}),
	computed: {
		config() {
			return this.$store.state.serverLocales
		},
		langs() {
			const { langs = [], lang } = this.$store.getters

			return langs.map(id => ({ id, def: id === lang }))
		},
		data() {
			if (!this.config) return null

			const { langs } = this

			return {
				count: langs.length,
				rows: langs
			}
		}
	},
	methods: {
		async balance() {
			const result = await Promise.all(
				this.selected.map(lang => this.$query(GetLocales, { lang }))
			)

			const balanced = this.balanceData(
				Object.assign(
					...this.selected.map((code, i) => ({
						[code]: (result[i] || {}).locales || {}
					}))
				)
			)

			await Promise.all(
				Object.entries(balanced).map(([lang, data]) =>
					this.$query(ModifyLocale, { lang, data })
				)
			)

			this.$root.$app.$emit('success', {
				message: 'Dictionaries balanced',
				reset: 5000,
				redirect: 1,
				onRedirect: () => {
					this.selected = []

					this.$refs.table.$emit('reset')
					this.$refs.table.$emit('refetch', 0)

					return true
				}
			})
		},
		balanceData(data) {
			const all = {}

			Object.values(data).forEach(row => {
				Object.entries(row).forEach(([key, value]) => {
					if (!all[key]) Object.assign(all, { [key]: value })
				})
			})

			Object.keys(data).forEach(code => {
				Object.assign(data, { [code]: all })
			})

			return data
		}
	}
}
</script>

<style scoped>
article {
	display: grid;
	grid-template-columns: [row] auto [row] min-content;
	grid-template-rows: auto;
}
article > div {
	padding: 5px;
}
</style>

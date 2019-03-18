<template>
	<section>
		<Header />
		<article>
			<table>
				<Thead />
				<Tbody />
			</table>
		</article>
		<Footer />
	</section>
</template>

<script>
import Header from './header.vue'
import Footer from './footer.vue'
import Thead from './thead.vue'
import Tbody from './tbody.vue'

import props from './props'
import api from '../../controllers/api'

export default {
	props,
	mixins: [api],
	components: { Header, Footer, Thead, Tbody },
	data: () => ({
		count: null,
		rows: null,
		selected: [],
		filtered: {},
		searched: {},
		paramsLimit: null,
		paramsOffset: null,
		paramsOrder: null
	}),
	computed: {
		target() {
			return this.$parent
		},
		limit: {
			get() {
				return this.paramsLimit || this.input.params.limit || 10
			},
			set(limit) {
				this.paramsLimit = limit

				this.$emit('refetch', 10)
			}
		},
		offset: {
			get() {
				if (this.paramsOffset !== null) return this.paramsOffset

				return this.input.params.offset
			},
			set(page) {
				this.paramsOffset = ((page || 1) - 1) * this.limit

				this.$emit('refetch', 10)
			}
		},
		order: {
			get() {
				return this.paramsOrder || this.input.params.order
			},
			set(order) {
				this.paramsOrder = order

				this.$emit('refetch', 10)
			}
		},
		filter: {
			get() {
				return this.filtered
			},
			set(filtered) {
				this.filtered = filtered

				if (Object.keys(filtered).length) this.$emit('refetch', 10)
			}
		},
		search: {
			get() {
				return this.searched
			},
			set({ columns, search }) {
				this.searched = search ? { columns, iLike: `%${search}%` } : {}

				this.$emit('refetch', 10)
			}
		},
		selectAll: {
			get() {
				return this.rows && this.rows.length && this.selected.length === this.rows.length
			},
			set(checked = false) {
				this.selected = checked ? this.rows.map(({ id }) => id) : []
			}
		},
		showCheckboxes() {
			return this.options.showCheckboxes
		}
	},
	watch: {
		data() {
			this.selected = []
			this.getData()
		},
		selected(selected) {
			this.target.$emit('selected', selected)
			this.$emit('input', selected)
		},
		$route() {
			if (!Object.keys(this.$route.query).length) {
				this.$emit('reset')
				this.$emit('refetch', 10)
			}
		}
	},
	methods: {
		async getData() {
			if (this.query) {
				const { input, filter = {}, limit, offset, order, search } = this

				const result = await this.$query(this.query, {
					input: { ...input, ...filter, params: { limit, offset, order, search } }
				})

				const { count = null, rows = null } =
					(await this.dataHook.call(
						this.target,
						Object.values(result || {}).find(row => row) || {}
					)) || {}

				this.count = count
				this.rows = rows
			}

			if (Object.keys(this.data).length && this.data.count) {
				this.rows = this.data.rows
				this.count = this.data.count
			}
		},
		async remove() {
			if (window.confirm('Remove selected?')) {
				const {
					remove: { query }
				} = this.actions

				if (!query)
					return this.$root.$app.$emit('error', {
						type: 'TABLE_ERROR',
						message: 'Query is not provided'
					})

				await this.$query(
					query,
					{ id: this.selected },
					{
						onSuccess: {
							message: 'Data removed',
							reset: 5000,
							redirect: 1,
							onRedirect: () => {
								this.selected = []
								this.getData()
							}
						},
						onError: {
							reset: 1,
							onReset: () => {
								this.selected = []
							}
						}
					}
				)
			}

			this.selected = []

			return true
		},
		getId(item) {
			const { idKey } = this.options || {}

			return item[idKey || 'id'] || null
		},
		getActions(pos) {
			if (!this.actions) return null

			const list = Object.assign(
				{},
				...Object.entries(this.actions)
					.filter(
						([key, { position = 'row' }]) =>
							key && position.split(', ').find(row => row === pos)
					)
					.map(([key, value]) => ({ [key]: value }))
			)

			if (!Object.keys(list).length) return null

			return list
		}
	},
	created() {
		this.$on('reset', () => {
			this.selected = []
			this.filtered = {}
			this.paramsLimit = null
			this.paramsOffset = null
			this.paramsOrder = null
		})

		this.$on('refetch', (delay = 1000) => {
			setTimeout(() => {
				this.getData()
			}, delay)
		})
	},
	async mounted() {
		if (!Object.keys(this.$route.query).length) await this.getData()
	}
}
</script>

<style scoped>
section {
	height: 100%;
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: [row] min-content [row] auto [row] min-content;
}
article {
	overflow: auto;
	margin: -1px 0;
}
table {
	font-size: 13px;
	width: 100%;
	max-width: 100%;
	border-collapse: collapse;
}
</style>

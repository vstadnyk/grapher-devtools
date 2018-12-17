<template>
	<div>
		<p v-if="error" v-text="error" class="error" />
		<table>
			<thead>
				<tr>
					<th v-if="showCheckboxes" width="1">
						<input type="checkbox" v-model="selectAll">
					</th>
					<th
						v-for="[column, { sortable, name }] in Object.entries(fields)"
						:key="column"
						:valign="filter[column] ? 'top' : 'middle'"
					>
						<router-link v-if="sortable" :to="{
							query: Object.assign({}, $route.query, {
								column,
								sort: (order.sort || 'desc').toUpperCase() === 'DESC' ? 'ASC' : 'DESC'
							})
						}">
							{{ name || column }}
							<span v-if="sortable && order.column === column">
								{{ (order.sort || 'desc').toUpperCase() === 'DESC' ? '↓' : '↑' }}
							</span>
						</router-link>

						{{ !sortable ? name || column : '' }}

						<FilterRows
							v-if="filter[column]"
							:datalist="filter[column]"
							:name="column"
						/>
					</th>
					<th v-if="Object.keys(actions).length" width="1" />
				</tr>
			</thead>
			<tbody v-if="count">
				<tr v-for="(item, i) in rows" :key="i">
					<td v-if="showCheckboxes" align="center" width="1">
						<input type="checkbox" v-model="selected" :value="getId(item)">
					</td>
					<cell
						v-for="[column, { alias, width, align, valign, link } = {}] in Object.entries(fields)"
						:key="column"
						:width="width"
						:align="align"
						:valign="valign"
						:link="link"
						:id="link ? getId(item) : null"
						:value="item[alias] || item[column]"
						:hook="fieldHooks[alias || column]"
					>
						{{ item[alias] || item[column] }}
					</cell>
					<actions v-if="Object.keys(actions).length" :id="getId(item)" :actions="actions" />
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<td v-if="actions.remove && selected.length">
						<button class="btn remove" title="Remove selected" @click="remove">✕</button>
					</td>
					<td :colspan="Object.keys(fields).length + Object.keys(actions).length - (actions.remove && selected.length ? 1 : 0) + 1">
						<p>
							<Limiter
								:limit="limit"
								:count="count"
								:step="options.limitStep"
							/>
							<Pagination
								:count="count"
								:limit="limit"
							/>
						</p>
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
</template>

<script>
import Pagination from '../Pagination/list.vue'
import Limiter from '../Limiter.vue'
import cell from './cell.vue'
import actions from './actions.vue'
import FilterRows from './filter.vue'

export default {
	components: { Pagination, cell, actions, FilterRows, Limiter },
	data: () => ({
		error: null,
		count: null,
		rows: null,
		filterInput: {},
		selected: []
	}),
	props: {
		query: Object,
		input: {
			type: Object,
			default: () => ({
				params: {
					limit: 10,
					offset: 0,
					order: {
						column: 'id',
						sort: 'DESC'
					}
				}
			})
		},
		fields: {
			type: Object,
			default: () => ({ id: { name: 'ID', sortable: true, asLinkView: false } })
		},
		fieldHooks: {
			type: Object,
			default: () => ({})
		},
		filter: {
			type: Object,
			default: () => ({})
		},
		dataHook: {
			type: Function,
			default: async ({ count = null, rows = null } = {}) => ({ count, rows })
		},
		actions: {
			type: Object,
			default: () => ({})
		},
		options: {
			type: Object,
			default: () => ({
				limitStep: 10,
				idKey: 'id'
			})
		}
	},
	computed: {
		limit() {
			const { params: { limit = 10 } = {} } = this.input || {}

			return limit
		},
		order() {
			const {
				params: {
					order = {
						column: 'id',
						sort: 'DESC'
					}
				} = {}
			} = this.input || {}

			return order
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
			return !!Object.keys(this.fields).find(field => field === 'id')
		}
	},
	created() {
		const { page = 1 } = this.$route.query

		this.setPage(page)
		this.setOrder()

		this.$on('remove', id => {
			this.selected.push(id)
			this.remove()
		})

		this.$on('limiter', limit => this.setLimit(limit))
	},
	watch: {
		async $route({ query: { column = null, sort = null, page = 1, filter = null } } = {}) {
			this.setPage(page)

			this.setFilter(filter)

			this.setOrder(
				Object.assign({}, this.order, {
					column,
					sort
				})
			)

			this.error = null

			await this.getData()
		}
	},
	methods: {
		async getData() {
			const { query, input, filterInput } = this
			this.error = null

			this.$root.$app.$emit('loader', 'start')

			try {
				const data = await this.$api.query(query, {
					input: Object.assign({}, filterInput, input)
				})

				this.$root.$app.$emit('loader', 'done')

				const { count = null, rows = null } =
					(await this.dataHook.call(
						this.$parent,
						Object.values(data).find(row => row) || {}
					)) || {}

				this.$parent.$emit('data', { count, rows })

				this.count = count
				this.rows = rows
			} catch (error) {
				this.error = error.type

				this.$root.$app.$emit('loader', 'done')

				console.error(error)
			}
		},
		async remove() {
			if (!window.confirm('Remove selected?')) return null

			this.error = null

			const {
				remove: { query }
			} = this.actions

			if (!query) {
				this.error = 'Query is not provided'

				return null
			}

			this.$root.$app.$emit('loader', 'start')

			try {
				await this.$api.query(query, { id: this.selected })

				this.$root.$app.$emit('loader', 'done')

				this.rows = this.rows.filter(row => !this.selected.find(id => id === row.id))
				this.count = this.count - this.selected.length
			} catch (error) {
				this.error = error.type

				this.$root.$app.$emit('loader', 'done')

				console.error(error)
			}

			this.selected = []

			return true
		},
		setLimit(limit = 10) {
			this.input.params.limit = limit

			this.setPage(1)
		},
		setOrder(order = null) {
			const { query } = this.$route

			if (order && order.sort) this.input.params.order = order

			if (query.sort && !order) this.input.params.order = query

			if (!query.sort && this.input.params.order) {
				this.$router.push({
					query: Object.assign({}, this.$route.query, this.input.params.order)
				})
			}
		},
		setPage(page = 1) {
			this.input.params.offset = (page - 1) * this.input.params.limit
		},
		setFilter(filter) {
			this.filterInput = {}

			try {
				Object.assign(this.filterInput, JSON.parse(filter))
			} catch (error) {
				console.error('Filter is not valid', error)
			}
		},
		getId(item) {
			const { idKey = 'id' } = this.options || {}

			return item[idKey] || null
		}
	}
}
</script>

<style scoped>
th a {
	white-space: nowrap;
}
tfoot p {
	margin: 0;
	display: flex;
	justify-content: space-between;
}
footer {
	margin-top: 10px;
}
input.limit {
	width: 50px;
}
.pagination {
	text-align: right;
	margin-bottom: 10px;
}
button.remove {
	padding: 8px 11px;
	background-color: indianred;
	color: whitesmoke;
}
</style>

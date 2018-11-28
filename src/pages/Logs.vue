<template>
	<section>
		<header>
			<p v-if="!viewer">
				<button @click="refresh" class="btn hightlight">Refresh</button>
				<button v-if="count" @click="clear" class="btn hightlight">Clear</button>
			</p>
			<p v-if="viewer">
				<button @click="viewerClose" class="btn hightlight">Close</button>
			</p>
		</header>

		<p v-if="error" v-text="error" class="error"/>

		<div v-if="!viewer">
			<p v-if="count && count > limit" align="right">
				<Pagination ref="Pagination" :count="count" :limit="limit"/>
			</p>
			<table>
				<tr>
					<th v-for="row in fields" :key="row.key">
						<span>{{ row.name || row.key }}</span>
						<form @submit.prevent="filterSubmit" @reset="filterReset" v-if="row.input">
							<input :name="row.key" required />
							<button class="btn" type="submit">OK</button>
							<button class="btn" type="reset">Reset</button>
						</form>
						<p v-if="row.select">
							<select @change="filterSelect" :name="row.key">
								<option v-for="option in row.select.options" :key="option">{{ option }}</option>
							</select>
						</p>
					</th>
				</tr>
				<tbody v-if="count">
					<tr v-for="(row, i) in rows" :key="i">
						<td v-for="field in fields" :key="field.key" @click="view(row)">
							{{ row[field.alias] || row[field.key] }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="viewer" class="viewer">
			<table>
				<tbody>
					<tr v-for="[key, value] in Object.entries(viewer)" :key="key">
						<th width="1">{{ key }}</th>
						<td><code>{{ value }}</code></td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>

<script>
import { ServerLog as query, ClearServerLog as mutation } from '../graphql/Logs.gql'
import Form from '../controllers/form'
import Pagination from '../components/ui/Pagination/list.vue'

export default {
	name: 'Logs',
	components: { Pagination },
	data: () => ({
		rows: null,
		count: null,
		error: null,
		viewer: null,
		limit: 30,
		offset: 0,
		filtered: {}
	}),
	props: {
		type: {
			type: String,
			default: 'errors'
		},
		fields: {
			type: Array
		}
	},
	watch: {
		async type() {
			this.rows = null
			this.count = null
			this.error = null
			this.offset = 0

			await this.refresh()
		},
		async offset() {
			await this.refresh()
		}
	},
	methods: {
		async refresh() {
			const { type, limit, offset, filtered } = this
			const variables = {
				type,
				input: {
					...filtered,
					params: {
						order: {
							column: 'date',
							sort: 'DESC'
						},
						limit,
						offset
					}
				}
			}

			this.$parent.$emit('loader', 'start')

			try {
				const { serverLog: log } = await this.$api.query(query, variables)

				this.count = log.count ? log.count : null
				this.rows = log.count ? log.rows : null

				this.$parent.$emit('loader', 'done')
			} catch (error) {
				this.error = error.type

				this.$parent.$emit('loader', 'done')

				console.error(error)
			}
		},
		async clear() {
			const { type } = this

			this.$parent.$emit('loader', 'start')

			try {
				const isClear = await this.$api.mutate(mutation, { type })

				if (isClear) {
					this.count = null
					this.rows = null
				}

				this.$parent.$emit('loader', 'done')
			} catch (error) {
				this.$parent.$emit('loader', 'done')

				this.error = error.type

				console.error(error)
			}
		},
		view(row) {
			this.viewer = row
		},
		viewerClose() {
			this.viewer = null
		},
		async filterSelect({ target: { value, name } }) {
			if (value !== 'all') this.filtered = { [name]: value }
			if (value === 'all') this.filtered = {}

			await this.refresh()
		},
		async filterSubmit({ target: form }) {
			this.filtered = Form.getData(form)

			await this.refresh()
		},
		async filterReset() {
			this.filtered = {}

			await this.refresh()
		}
	},
	async created() {
		await this.refresh()

		this.$on('paginate', page => {
			this.offset = page - 1
		})
	}
}
</script>

<style scoped>
header p {
	margin: 0;
	margin-left: -5px;
	margin-bottom: 10px;
}
header button {
	margin: 0 5px;
}
table {
	font-size: 13px;
	width: 100%;
	max-width: 100%;
	border-collapse: collapse;
}
td,
th {
	border: 1px solid #ccc;
	padding: 5px;
}
th {
	text-align: center;
}
th p,
th form {
	margin: 0;
	margin-top: 10px;
}
th select {
	width: 100%;
}
th button {
	padding: 4px 8px;
	margin-left: 5px;
}
td {
	vertical-align: top;
}
td.code {
	white-space: pre-wrap;
}
tbody tr {
	cursor: pointer;
}
tbody tr:hover {
	background-color: #eee;
}
div.viewer {
	overflow: auto;
}
code {
	display: block;
	max-width: 700px;
	white-space: pre-wrap;
	word-break: break-all;
}
</style>

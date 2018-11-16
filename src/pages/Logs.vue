<template>
	<section>
		<header>
			<h1>
				<span>{{ type }}</span>
				log
			</h1>
			<p>
				<button @click="refresh" class="btn hightlight">Refresh</button>
				<button v-if="count" @click="clear" class="btn hightlight">Clear</button>
			</p>
		</header>
		<div v-if="loading">Loading...</div>
		<p v-if="error" class="error">{{ error }}</p>
		<p v-if="count" align="right">
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
					<td v-for="field in fields" :key="field.key">
						{{ row[field.alias] || row[field.key] }}
					</td>
				</tr>
			</tbody>
		</table>
		<p v-if="count" align="right">
			<Pagination ref="Pagination" :count="count" :limit="limit"/>
		</p>
	</section>
</template>

<script>
import { ServerLog as query, ClearServerLog as mutation } from '../graphql/Info.gql'
import Error from '../controllers/error'
import Form from '../controllers/form'
import Pagination from '../components/ui/Pagination/list.vue'

export default {
	name: 'Logs',
	components: { Pagination },
	data: () => ({
		rows: null,
		count: null,
		error: null,
		loading: null,
		limit: 10,
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
						limit,
						offset
					}
				}
			}

			try {
				const {
					data: { serverLog: log }
				} = await this.$apollo.query({ query, variables, fetchPolicy: 'network-only' })

				this.count = log.count ? log.count : null
				this.rows = log.count ? log.rows : null
			} catch (error) {
				this.error = Error.format(error, 'type')

				console.error(Error.format(error, 'type'))
			}
		},
		async clear() {
			const { type } = this

			this.loading = true

			try {
				const isClear = await this.$apollo.mutate({
					mutation,
					variables: { type }
				})

				if (isClear) {
					this.count = null
					this.rows = null
				}

				this.loading = null
			} catch (error) {
				this.loading = null
				this.error = Error.format(error, 'type')

				console.error(Error.format(error, 'type'))
			}
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
h1 {
	margin: 0;
}
h1 span {
	text-transform: capitalize;
}
header p {
	margin-left: -5px;
}
header button {
	margin: 0 5px;
}
table {
	font-size: 13px;
	width: 100%;
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
	padding: 8px;
	margin-left: 5px;
}
td {
	vertical-align: top;
}
</style>

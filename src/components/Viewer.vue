<template>
	<article>
		<p v-if="options.backLink"><back>← Back</back></p>
		<div :class="options.border ? 'border' : null">
			<json-editor v-if="output" v-model="output" v-bind="options" />
		</div>
	</article>
</template>

<script>
import JsonEditor from 'grapher-json-ui'
import 'grapher-json-ui/dist/index.css'

import back from './BackLink.vue'

import api from '../controllers/api'

export default {
	mixins: [api],
	components: { back, JsonEditor },
	data: () => ({ output: null }),
	props: {
		query: {
			type: [Object, String]
		},
		data: {
			type: [Object, Array, Promise],
			default: null
		},
		filter: {
			type: Function,
			default: row => row
		},
		dataHook: {
			type: Function,
			default: data => data
		},
		fieldHooks: {
			type: Object,
			default: () => ({})
		},
		options: {
			type: Object,
			default: () => ({
				backLink: true,
				brackets: true,
				editable: false,
				border: true
			})
		},
		variables: {
			type: Object,
			default: null
		},
		value: null
	},
	computed: {
		input() {
			if (this.variables) return this.variables

			return { id: this.$route.params.id }
		}
	},
	watch: {
		async data() {
			await this.getData()
		},
		output(data) {
			this.$emit('input', data)
		}
	},
	async created() {
		if (this.data) {
			await this.getData()
		} else if (!this.query) {
			this.$parent.$emit('error', {
				type: 'DATA_VIEWER_ERROR',
				message: 'Query is not valid',
				dump: {
					query: typeof this.query
				}
			})
		} else {
			const result = await this.get()
			this.output = await this.result(result)
		}
	},
	methods: {
		async get() {
			const request = await this.$query(this.query, this.input)

			if (!request) {
				this.$parent.$emit('error', {
					type: 'DATA_VIEWER_ERROR',
					message: 'Query return null',
					dump: {
						input: this.input
					}
				})

				return {}
			}

			const result =
				Object.keys(request).length === 1 ? Object.values(request).shift() : request

			return result
		},
		async getData() {
			if (this.data instanceof Promise) {
				try {
					const data = await this.data

					this.output = await this.result(data)
				} catch (error) {
					this.output = error
				}
			} else {
				this.output = await this.result(this.data)
			}
		},
		async result(input = {}) {
			let result = await this.dataHook.call(this.$parent, input)

			if (!Object.keys(result).length) return result

			if (this.filter) {
				result = Object.assign(
					...Object.entries(result)
						.filter(([key, value]) => this.filter.call(this.$parent, key, value))
						.map(([key, value]) => ({ [key]: value }))
				)
			}

			return Object.assign(
				...Object.entries(result).map(([key, value]) =>
					this.fieldHooks[key]
						? this.fieldHooks[key].call(this.$parent, key, value)
						: { [key]: value }
				)
			)
		}
	}
}
</script>

<style scoped>
p {
	margin: 0;
	margin-bottom: 10px;
}
.border {
	border: 1px solid #ccc;
	padding: 10px;
}
</style>

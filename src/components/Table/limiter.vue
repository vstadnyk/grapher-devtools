<template>
	<label v-if="step && count">
		Limit: <input type="range" :step="step" :min="min" :max="max" v-model="model" />
		<output>{{ model }} / {{ count }}</output>
	</label>
</template>

<script>
export default {
	props: {
		value: Number,
		count: {
			type: Number,
			default: null
		},
		min: {
			type: Number,
			default: 1
		},
		step: {
			type: Number,
			default: 10
		}
	},
	created() {
		if (this.$route.query.limit) this.$emit('input', parseInt(this.model, 0))
	},
	watch: {
		model(limit) {
			this.$emit('input', parseInt(limit, 0))
		}
	},
	computed: {
		list() {
			return new Array(5).fill(0).map((v, i) => (i + 1) * this.step)
		},
		max() {
			return this.list[this.list.length - 1] + this.step
		},
		model: {
			get() {
				return this.$route.query.limit || this.value
			},
			set(value) {
				const limit = parseInt(value, 0) - 1 || 1

				const query = Object.assign({}, this.$route.query)

				delete query.limit

				Object.assign(query, { limit })

				this.$router.push({ query })
			}
		}
	}
}
</script>

<style scoped>
label {
	display: inline-flex;
	align-items: center;
}
input {
	cursor: pointer;
	margin: 0 10px;
	width: 200px;
	border: none;
}
</style>

<template>
	<label>
		Limit:
		<input
			type="range"
			:step="step"
			:min="step"
			:max="max"
			list="limiter-options"
			v-model="value"
			@change="change"
		/>
		<datalist id="limiter-options">
			<option v-for="i in list" :key="i" :value="i">
				{{ i }}
			</option>
		</datalist>
		{{ tmp || limit }} / {{ count }}
	</label>
</template>

<script>
export default {
	data: () => ({
		tmp: null
	}),
	props: {
		limit: Number,
		count: Number,
		step: {
			type: Number,
			default: 10
		}
	},
	computed: {
		list() {
			return new Array(5)
				.fill(0)
				.map((v, i) => (i + 1) * 10)
				.filter(r => r <= this.count)
		},
		max() {
			return this.list[this.list.length - 1] + 10
		},
		value: {
			get() {
				return this.tmp || this.limit
			},
			set(value) {
				this.tmp = value
			}
		}
	},
	methods: {
		input({ target: { value: limit } }) {
			this.tmp = limit
		},
		change() {
			this.$parent.$emit('limiter', parseInt(this.value, 0))
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
	width: 180px;
	border: none;
}
</style>

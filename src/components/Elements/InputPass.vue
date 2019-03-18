<template>
	<span>
		<span>
			<Input
				v-bind="{
					label,
					disabled,
					required
				}"
				v-model="model"
			/>
		</span>
		<button @click="click" type="button" class="btn">Generate</button>
	</span>
</template>

<script>
import PassGenerator from 'password-generator'
import input from './input'

import Input from './Input.vue'

export default {
	components: { Input },
	mixins: [input],
	data: () => ({ pass: null }),
	computed: {
		model: {
			get() {
				return this.pass
			},
			set(value) {
				this.pass = value
				this.$emit('input', value)
			}
		}
	},
	methods: {
		click() {
			this.model = PassGenerator(10, false)
		}
	}
}
</script>

<style scoped>
span {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}
span > span {
	display: inline-block;
	width: calc(100% - 120px);
}
button {
	padding: 8px 20px;
}
</style>

<template>
	<Label v-bind="{ label, required, lang }">
		<select v-bind="bind" v-model="model" :class="error ? 'error' : null">
			<option v-if="appendEmpty" :value="undefined">-Not set-</option>
			<option
				v-for="[value, text] in Object.entries(list)"
				v-text="text"
				:key="value"
				:value="value"
			/>
		</select>
	</Label>
</template>

<script>
import input from './input'

export default {
	mixins: [input],
	computed: {
		list() {
			const { options } = this

			if (Array.isArray(options))
				return Object.assign(
					{},
					Object.assign(...(options || [{}]).map(row => ({ [row]: row })).concat([{}]))
				)

			return options || {}
		},
		first() {
			return Object.keys(this.list).find(row => row)
		}
	},
	watch: {
		list() {
			if (!this.appendEmpty && this.value === undefined) this.model = this.first
		}
	},
	created() {
		if (!this.appendEmpty && this.value === undefined) this.model = this.first
	},
	props: {
		options: {
			type: null,
			default: () => ({})
		},
		appendEmpty: {
			type: Boolean,
			default: true
		}
	}
}
</script>

<style scoped>
select {
	font-family: inherit;
	font-size: inherit;
	border: 1px solid #ccc;
	padding: 7px;
	width: 100%;
	appearance: none;
	border-radius: 0;
	padding-right: 22px;
	background-position: calc(100% - 3px) 50%;
	background-repeat: no-repeat;
	background-size: 16px;
	background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7.406 7.828l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z'%3E%3C/path%3E%3C/svg%3E");
}
</style>

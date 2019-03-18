<template>
	<Label v-bind="{ label, required, lang, error }">
		<input
			v-model="model"
			v-bind="
				Object.assign(
					{ ...bind },
					{ step, min, max, autocomplete: autocomplete === false ? 'off' : null }
				)
			"
			:list="datalist ? `${id}-list` : null"
			:class="error ? 'error' : null"
		/>
		<datalist v-if="datalist" :id="`${id}-list`">
			<option
				v-for="[value, text] in Object.entries(datalist)"
				v-text="text"
				:value="value"
				:key="value"
			/>
		</datalist>
	</Label>
</template>

<script>
import input from './input'

export default {
	mixins: [input],
	props: {
		step: {
			type: null,
			default: null
		},
		min: {
			type: Number,
			default: null
		},
		max: {
			type: Number,
			default: null
		},
		autocomplete: {
			type: Boolean,
			default: null
		},
		datalist: {
			type: null,
			default: null
		}
	}
}
</script>

<style scoped>
input {
	font-family: inherit;
	font-size: inherit;
	border: 1px solid #ccc;
	padding: 7px;
	width: calc(100% - 16px);
}
*:disabled {
	background-color: #eee;
}
.error {
	border-color: red;
	color: inherit;
}
</style>

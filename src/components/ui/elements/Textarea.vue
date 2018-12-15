<template>
	<label>
		<sup v-if="required && label">*</sup>
		<span v-if="label">{{ lang ? `${label} (${lang})` : label }}:</span>
		<textarea
			v-model="model"
			:id="id"
			:cols="cols"
			:rows="rows"
			:name="name"
			:lang="lang"
			:required="required"
			:placeholder="required && placeholder ? `* ${placeholder}` : placeholder"
			:style="css"
		/>
	</label>
</template>

<script>
export default {
	data: () => ({
		val: null
	}),
	computed: {
		model: {
			get() {
				return this.val || this.value
			},
			set(value) {
				this.$parent.$emit(
					`${this.name}Change`,
					this.lang ? { lang: this.lang, value } : value
				)

				this.val = value
			}
		}
	},
	props: {
		label: {
			type: String,
			default: null
		},
		id: {
			type: String,
			default: null
		},
		cols: {
			type: Number,
			default: null
		},
		rows: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: null
		},
		lang: {
			type: String,
			default: null
		},
		value: {
			type: String,
			default: null
		},
		required: {
			type: Boolean,
			default: null
		},
		placeholder: {
			type: String,
			default: null
		},
		css: {
			type: String,
			default: null
		}
	}
}
</script>

<style scoped>
label {
	display: block;
}
span {
	display: inline-block;
	padding: 5px 0;
}
textarea {
	width: 100%;
	min-height: 200px;
}
</style>

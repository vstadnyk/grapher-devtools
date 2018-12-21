<template>
	<label>
		<sup v-if="required && label">*</sup>
		<span v-if="label">{{ lang ? `${label} (${lang})` : label }}:</span>
		<input
			v-model="model"
			:id="id"
			:list="datalist ? `${id}-list` : null"
			:type="inputType === 'string' ? 'text' : inputType"
			:name="name"
			:lang="lang"
			:required="required"
			:placeholder="required && placeholder ? `* ${placeholder}` : placeholder"
			:step="step"
			:min="min"
			:max="max"
			:class="(cssClass || '').concat(error ? ' error' : '') || null"
		>
		<datalist v-if="datalist" :id="`${id}-list`">
			<option
				v-for="[value, text] in Object.entries(datalist)"
				:value="value"
				:key="value"
			>
				{{ text }}
			</option>
		</datalist>
		<span v-if="error" class="error">{{ error }}</span>
	</label>
</template>

<script>
import Form from '../../../controllers/form'

export default {
	data: () => ({
		val: null,
		error: null
	}),
	computed: {
		model: {
			get() {
				return this.val || this.value
			},
			set(val) {
				this.val = val

				const value = this.validate()

				const data = this.lang ? { lang: this.lang, value } : value

				this.$emit('change', data)
			}
		},
		inputType() {
			if (this.type === 'search') return this.type
			if (this.validType) return this.validType.name.toLowerCase()

			return this.type
		}
	},
	methods: {
		validate(value = null) {
			if (!this.validType) return null

			if (this.required && !value) this.error = 'This field is required'

			try {
				return Form.validator(this.validType, value || this.val)
			} catch ({ message: error }) {
				this.error = error

				return null
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
		datalist: {
			type: null,
			default: null
		},
		type: {
			type: String,
			default: 'text'
		},
		validType: {
			type: null,
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
			type: null,
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
		step: {
			type: Number,
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
		cssClass: {
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
input {
	width: 100%;
}
sup {
	color: red;
	padding-right: 3px;
}
input.error {
	border-color: red;
	color: inherit;
}
span.error {
	font-weight: normal;
	display: block;
	margin-top: 5px;
}
</style>

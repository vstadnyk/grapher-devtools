<template>
	<label>
		<sup v-if="required && label">*</sup>
		<span v-if="label">{{ label }}:</span>
		<select
			v-if="list"
			v-model="model"
			:id="id"
			:name="name"
			:class="(cssClass || '').concat(error ? ' error' : '') || null"
			:required="required"
		>
			<option
				v-for="[value, text] in Object.entries(list)"
				:key="value"
				:value="value"
			>
				{{ text }}
			</option>
		</select>
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
				return this.val || this.value || ''
			},
			set(val) {
				this.val = val

				this.$emit('change', this.validate())
			}
		},
		list() {
			const { options = null } = this
			const empty = {
				'': '-Not set-'
			}

			if (!options) return null

			if (Array.isArray(options)) return Object.assign({}, empty, Form.arrayToObject(options))

			return Object.assign({}, empty, options)
		}
	},
	created() {
		if (!this.options) this.error = 'Options is not provided'
	},
	methods: {
		validate(value = null) {
			if (this.required && !value) this.error = 'This field is required'

			try {
				return Form.validator(this.validType, value || this.val, this.list)
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
		options: {
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
		value: {
			type: null,
			default: null
		},
		required: {
			type: Boolean,
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
select {
	width: 100%;
}
</style>

<template>
	<label>
		<sup v-if="required && label">*</sup>
		<span v-if="label">{{ label }}:</span>
		<input
			v-model="model"
			type="checkbox"
			:name="name"
			:id="id"
			:value="checked"
		>
	</label>
</template>

<script>
export default {
	data: () => ({
		checked: null
	}),
	computed: {
		model: {
			get() {
				return this.checked !== null ? this.checked : this.value
			},
			set(val) {
				this.checked = val
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
		name: {
			type: String,
			default: null
		},
		value: {
			type: Boolean,
			default: true
		},
		required: {
			type: Boolean,
			default: null
		}
	}
}
</script>

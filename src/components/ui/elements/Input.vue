<template>
	<label>
		<sup v-if="required && label">*</sup>
		<span v-if="label">{{ lang ? `${label} (${lang})` : label }}:</span>
		<input
			v-model="model"
			:id="id"
			:list="datalist ? `${id}-list` : null"
			:type="type"
			:name="name"
			:lang="lang"
			:required="required"
			:placeholder="required && placeholder ? `* ${placeholder}` : placeholder"
			:step="step"
			:min="min"
			:max="max"
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
					`${this.id || this.name}Change`,
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
		datalist: {
			type: null,
			default: null
		},
		type: {
			type: String,
			default: 'text'
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
</style>

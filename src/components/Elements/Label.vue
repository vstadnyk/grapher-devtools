<template>
	<label>
		<sup v-if="required && label">*</sup>
		<span v-if="label">{{ lang ? `${label} (${lang})` : label }}:</span><slot />
		<span v-if="error" class="error">{{ error }}</span>
	</label>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: null
		},
		lang: {
			type: String,
			default: null
		},
		required: {
			type: Boolean,
			default: null
		},
		error: {
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
span.error {
	font-weight: normal;
	display: block;
	margin-top: 5px;
}
sup {
	color: red;
	padding-right: 3px;
}
</style>

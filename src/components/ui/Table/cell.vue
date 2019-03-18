<template>
	<td :width="width" :align="align" :valign="valign">
		{{ !href ? text : '' }}

		<router-link v-if="href" :to="href">{{ text }}</router-link>

		<p v-for="{ lang, value } in translations" :key="lang">
			<b>{{ lang }}:</b>
			{{ value }}
		</p>
	</td>
</template>

<script>
export default {
	props: {
		value: null,
		width: String,
		align: String,
		id: String,
		valign: {
			type: String,
			default: 'middle'
		},
		link: {
			type: String,
			default: null
		},
		hook: {
			type: Function,
			default: v => v
		}
	},
	computed: {
		href() {
			if (!this.link) return null

			return (this.link || '').concat(this.id || '')
		},
		text() {
			let val = this.value

			if (Array.isArray(this.value)) {
				const { value = null } =
					this.value.find(({ lang = null } = {}) => lang === this.$store.getters.lang) ||
					{}

				val = value || val
			}

			return this.hook.call(this.$parent.$parent, val)
		},
		translations() {
			if (!Array.isArray(this.value)) return []

			return this.value.filter(({ lang }) => lang !== this.$store.getters.lang)
		}
	}
}
</script>

<style scoped>
p {
	color: darkgray;
	margin: 3px 0;
}
</style>

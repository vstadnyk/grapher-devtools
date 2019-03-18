<template>
	<section>
		<label v-for="l in locales" :key="l" :class="`btn ${l === active ? ' hightlight' : ''}`">
			<input type="radio" name="langSwitcher" :value="l" v-model="active" />
			{{ langs[l] }}
		</label>
	</section>
</template>

<script>
import { ServerLocales } from '../../graphql/Info.gql'

export default {
	data: () => ({
		active: null,
		langs: {
			en: 'English',
			uk: 'Ukrainian'
		}
	}),
	watch: {
		active() {
			this.$parent.$emit('localeChange', this.active)
		}
	},
	computed: {
		locales() {
			const { active = [] } = this.$store.state.serverLocales || {}

			return active
		}
	},
	async created() {
		if (!this.$store.state.serverLocales) {
			try {
				const { serverInfo: { locales } = {} } =
					(await this.$api.query(ServerLocales)) || {}

				this.$store.commit('setServerLocales', locales)
			} catch (error) {
				console.error(error)
			}
		}

		const { default: active = null } = this.$store.state.serverLocales || {}

		this.active = active || this.locales.find(r => r) || null
	}
}
</script>

<style scoped>
section {
	padding-top: 10px;
	margin-bottom: -1px;
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
}
label {
	cursor: pointer;
	display: inline-block;
}
input {
	display: none;
}
</style>

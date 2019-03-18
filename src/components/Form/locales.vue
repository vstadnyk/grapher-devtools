<template>
	<div>
		<label>Language: </label>
		<template v-for="lang in $store.getters.langs">
			<span
				v-if="lang === active"
				v-text="lang"
				:key="lang"
				class="btn hightlight"
				disabled
			/>
			<router-link
				v-else
				:to="{
					query: Object.assign({}, query, lang === $store.getters.lang ? {} : { lang })
				}"
				v-text="lang"
				append
				:key="lang"
				class="btn"
			/>
		</template>
	</div>
</template>

<script>
import { ServerLocales } from '../../graphql/Info.gql'
import api from '../../controllers/api'

export default {
	mixins: [api],
	watch: {
		$route() {
			this.$emit('input', this.active)
		}
	},
	computed: {
		active() {
			return this.value || this.$route.query.lang || this.$store.getters.lang
		},
		query() {
			const query = { ...this.$route.query }

			delete query.lang

			return query
		}
	},
	async created() {
		if (!this.$store.state.serverLocales) {
			const { serverInfo: { locales = {} } = {} } = (await this.$query(ServerLocales)) || {}

			this.$store.commit('setServerLocales', locales)
		}

		if (!this.value) this.$emit('input', this.active)
	}
}
</script>

<style scoped>
label {
	color: gray;
	font-size: 13px;
}
a {
	color: inherit;
	text-decoration: none;
	display: inline-block;
}
</style>

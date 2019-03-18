<template>
	<section>
		<div>
			<router-link
				v-for="[tab, text] in Object.entries(tabs)"
				:key="tab"
				:to="{ query: Object.assign({}, query, tab === first ? {} : { tab }) }"
				v-text="text"
				:class="`btn ${tab === active ? ' hightlight' : ''}`"
				append
			/>
		</div>
		<locales v-if="$parent.lang !== undefined" v-model="$parent.lang" />
	</section>
</template>

<script>
import locales from './locales.vue'

export default {
	components: { locales },
	props: {
		tabs: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		active() {
			return this.$route.query.tab || this.first
		},
		first() {
			return Object.keys(this.tabs).find(row => row)
		},
		query() {
			const query = { ...this.$route.query }

			delete query.tab

			return query
		}
	},
	watch: {
		$route() {
			this.$emit('input', this.active)
		}
	},
	created() {
		this.$emit('input', this.active)
	}
}
</script>

<style scoped>
section {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
a {
	color: inherit;
	text-decoration: none;
	display: inline-block;
}
</style>

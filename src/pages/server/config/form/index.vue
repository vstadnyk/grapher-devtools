<template>
	<form @submit.prevent="$emit('submit')">
		<top :id="key" />
		<hr />
		<div class="entry"><json class="json" v-model="data.value" /> <general /></div>
		<hr />
		<bottom :active="data.active" />
	</form>
</template>

<script>
import Json from 'grapher-json-ui'
import 'grapher-json-ui/dist/index.css'

import Controller from '../../../../components/Form/controller'

import General from './general.vue'

import { Config as query, Modify } from '../../../../graphql/Config.gql'

export default {
	mixins: [Controller],
	components: { General, Json },
	data: () => ({
		query,
		fields: {
			key: {
				type: String,
				required: true
			},
			value: {
				type: Object,
				required: true
			},
			active: {
				type: Boolean,
				default: true
			}
		}
	}),
	computed: {
		key() {
			return this.id || null
		},
		where() {
			if (!this.key) return null

			return { input: { key: this.key } }
		}
	},
	methods: {
		submit({ input }) {
			this.$save(Modify, input, 'Config saved')
		}
	}
}
</script>

<style scoped>
.entry {
	display: grid;
	grid-template-columns: [col] auto [col] 450px;
	grid-template-rows: auto;
}
.json {
	margin: 15px 0;
}
</style>

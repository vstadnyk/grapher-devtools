<template>
	<form @submit.prevent="$emit('submit')">
		<top v-if="editable" />
		<p v-else><back>← Back</back></p>
		<json class="entry" v-model="model" :editable="editable" />
		<bottom v-if="editable" :hide="['active']" />
	</form>
</template>

<script>
import Json from 'grapher-json-ui'
import 'grapher-json-ui/dist/index.css'

import Controller from '../../../components/Form/controller'
import back from '../../../components/BackLink.vue'

import { GetLocales as query, ModifyLocale } from '../../../graphql/Locale.gql'

export default {
	mixins: [Controller],
	components: { back, Json },
	data: () => ({ query }),
	props: {
		editable: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		where() {
			return { id: this.id }
		},
		model: {
			get() {
				return this.data
			},
			set(data) {
				this.data = {}
				this.data = data
			}
		}
	},
	methods: {
		submit() {
			this.$save(ModifyLocale, { data: this.data, lang: this.id }, 'Lexicon saved')
		}
	}
}
</script>

<style scoped>
.entry {
	margin-bottom: 15px;
}
p {
	margin: 0;
	margin-bottom: 10px;
}
</style>

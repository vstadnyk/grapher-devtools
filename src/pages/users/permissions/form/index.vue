<template>
	<form @submit.prevent="$emit('submit')">
		<top :id="id" /><tabs
			:tabs="{
				general: 'General',
				rules: 'Rules'
			}"
			v-model="tab"
		/>
		<header v-show="tab === 'general'">
			<p><Input label="Name" name="name" v-model="data.name" required /></p>
			<p><Input label="Alias" name="alias" v-model="data.alias" required /></p>
		</header>
		<rules ref="rules" v-show="tab === 'rules'" />
		<hr />
		<bottom v-model="data.active" />
	</form>
</template>

<script>
import controller from '../../../../components/Form/controller'
import Rules from './rules.vue'

import {
	UserPermission as query,
	AddUserPermission as add,
	EditUserPermission as edit
} from '../../../../graphql/UserPermission.gql'

export default {
	mixins: [controller],
	components: { Rules },
	data: () => ({
		query,
		lang: undefined,
		fields: {
			name: {
				type: String,
				required: true
			},
			alias: {
				type: String,
				required: true
			},
			rules: {
				type: Object
			},
			active: {
				type: Boolean,
				default: true
			}
		}
	}),
	computed: {
		where() {
			return this.id ? { input: { id: this.id } } : null
		}
	},
	methods: {
		submit(data) {
			this.$save(this.id ? edit : add, data, 'Permission saved')
		}
	}
}
</script>

<style scoped>
header {
	display: grid;
	grid-template-columns: auto 300px;
	grid-column-gap: 15px;
}
</style>

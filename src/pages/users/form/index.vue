<template>
	<form @submit.prevent="$emit('submit')">
		<top :id="id" />

		<tabs :tabs="{ general: 'General', location: 'Location' }" v-model="tab" />
		<general v-show="tab === 'general'" /><location v-show="tab === 'location'" />

		<bottom v-if="data.id" />
	</form>
</template>

<script>
import controller from '../../../components/Form/controller'

import Bottom from './bottom.vue'
import General from './general.vue'
import Location from './location.vue'

import { GetUserByID as query, AddUser, EditUser, ChangePassword } from '../../../graphql/User.gql'

export default {
	components: { General, Location, Bottom },
	mixins: [controller],
	data: () => ({
		query,
		fields: {
			mail: {
				type: String,
				required: true
			},
			pass: {
				type: String,
				validation: false
			},
			firstName: {
				type: String
			},
			lastName: {
				type: String
			},
			fullName: {
				type: String
			},
			displayName: {
				type: String
			},
			phone: {
				type: String
			},
			photo: {
				type: String
			},
			role: {
				type: String
			}
		}
	}),
	computed: {
		where() {
			return this.id ? { id: this.id } : null
		}
	},
	methods: {
		async submit({ input, id }) {
			const { role: permission, pass } = input

			Object.assign(input, { permission })

			delete input.role // eslint-disable-line

			const { _editUser = null } =
				(await this.$save(this.id ? EditUser : AddUser, { input, id })) || {}

			if (_editUser && pass) this.$query(ChangePassword, { id, pass })
		}
	}
}
</script>

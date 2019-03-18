<template>
	<article>
		<back :to="{ name: 'editUser', params: { id: this.id } }">←Back</back>
		<hr />
		<div>
			<div>
				<h2>{{ active ? 'Enable' : 'Disable' }} user with ID "{{ id }}"?</h2>

				<template v-if="exist">
					<p><b>Template: </b>{{ tmpl }}</p>
					<p><checkbox label="Send custom" v-model="custom" /></p>
				</template>
				<p class="error" v-else>Template "{{ tmpl }}" not found</p>
			</div>
			<div>
				<form v-if="custom || !exist">
					<p><Input label="Subject" name="subject" required /></p>
					<p><Textarea label="Message" name="message" required /></p>
					<p><button class="btn hightlight">Send</button></p>
				</form>
			</div>
		</div>
	</article>
</template>

<script>
import back from '../../../components/BackLink.vue'
import controller from '../../../components/Form/controller'

// import { MailTemplateByAliasExist } from '../../../graphql/Mail.gql'

export default {
	mixins: [controller],
	data: () => ({
		custom: false,
		exist: false,
		user: null,
		currentUser: null
	}),
	components: { back },
	props: {
		tmpl: {
			type: String,
			default: null
		},
		active: {
			type: Boolean,
			default: false
		}
	},
	async created() {
		await this.$user.can('users-edit-status1')

		/* this.$on('send', data => {
			if (!this.tmpl) this.send(data)
		}) */
		/* if (this.tmpl) await this.isExist(this.tmpl)
		if (!this.tmpl) await this.getUsers() */

		/* await this.$user.can('users-edit-status1')

		const { exist } = (await this.$query(MailTemplateByAliasExist, { alias: this.tmpl })) || {}

		this.exist = !!exist */
	},
	methods: {
		async getUsers() {
			this.currentUser = await this.$user.current()
			this.user = await this.$user.one({ id: this.id })
		}
	}
}
</script>

<style scoped>
article > div {
	display: grid;
	grid-template-columns: [col] 400px [col] auto;
	grid-template-rows: auto;
	margin: 0 -10px;
}
article > div > div {
	padding: 0 10px;
}
</style>

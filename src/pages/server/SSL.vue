<template>
	<form @submit.prevent="$emit('submit')">
		<div>
			<Textarea
				label="Private key"
				required
				name="key"
				v-model="(data.ssl || {}).key"
				:class="$style.field"
			/>
			<Textarea
				label="Certificate"
				required
				name="cert"
				v-model="(data.ssl || {}).cert"
				:class="$style.field"
			/>
		</div>
		<p><button class="btn hightlight">Save</button></p>
	</form>
</template>

<script>
import controller from '../../components/Form/controller'

import { SSL as query, EditSSL as mutation } from '../../graphql/SSL.gql'

export default {
	mixins: [controller],
	data: () => ({
		query,
		where: true,
		fields: { ssl: { type: Object } }
	}),
	methods: {
		submit({ input: { ssl: { key, cert } = {} } }) {
			this.$save(mutation, { key, cert }, { redirect: false })
		}
	}
}
</script>

<style module>
.field textarea {
	font-size: 11px;
	height: 380px;
}
</style>

<style scoped>
form div {
	display: grid;
	grid-template-columns: auto auto;
	column-gap: 15px;
}
p {
	margin: 10px 0;
}
</style>

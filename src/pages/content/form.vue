<template>
	<form @submit.prevent="$emit('submit')">
		<top :id="id" />
		<tabs
			:tabs="{
				content: 'Content',
				details: 'Details'
			}"
			v-model="tab"
			:locales="lang"
			:class="$style.tabs"
		/>
		<div v-show="tab === 'content'">
			<header>
				<Input label="Name" name="name" v-model="data.name" :lang="lang" />
				<Input label="Alias" name="alias" v-model="data.alias" />
			</header>
			<Textarea
				label="Description"
				name="description"
				v-model="data.description"
				:lang="lang"
			/>
		</div>
		<div v-show="tab === 'details'">
			<InputImage name="photo" v-model="data.photo" thumbSize="280px" />
			<p><Input label="Position" name="position" v-model="data.position" type="number" /></p>
		</div>
		<bottom v-model="data.active" :class="$style.bottom" />
	</form>
</template>

<script>
import controller, { I18n } from '../../components/Form/controller'

import {
	ContentI18n as query,
	AddContent as add,
	EditContent as edit
} from '../../graphql/Content.gql'

export default {
	mixins: [controller],
	data: () => ({
		query,
		fields: {
			name: {
				type: I18n,
				default: null
			},
			description: {
				type: I18n,
				default: null
			},
			alias: {
				type: String,
				default: null
			},
			position: {
				type: Number,
				default: 0
			},
			photo: {
				type: String,
				default: null
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
			this.$save(this.id ? edit : add, data, 'Content saved')
		}
	}
}
</script>

<style module>
.bottom {
	padding-top: 15px;
}
.tabs {
	padding: 15px 0;
	border-bottom: 1px solid #ccc;
}
</style>

<style scoped>
header {
	display: grid;
	column-gap: 15px;
	padding: 10px 0;
	grid-template-columns: auto 250px;
}
</style>

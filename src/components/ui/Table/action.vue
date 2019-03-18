<template>
	<span>
		<button
			v-if="!href"
			@click="click"
			:class="`btn ${type}`"
			:title="dic[type].title"
			v-text="dic[type].icon"
		/>
		<router-link v-if="href" :to="href" :class="`btn ${type}`" :title="dic[type].title">
			{{ dic[type].icon }}
		</router-link>
	</span>
</template>

<script>
export default {
	data: () => ({
		dic: {
			view: {
				icon: '❏',
				title: 'View item'
			},
			edit: {
				icon: '✎',
				title: 'Edit item'
			},
			remove: {
				icon: '✕',
				title: 'Remove item'
			}
		}
	}),
	computed: {
		href() {
			if (!this.action.href) return null

			return this.action.href.concat(this.id)
		}
	},
	props: {
		id: String,
		type: String,
		action: Object
	},
	methods: {
		click() {
			this.$parent.$parent.$emit(this.type, this.id)
		}
	}
}
</script>

<style scoped>
button,
a {
	padding: 8px 11px;
	margin: 0 3px;
	font-size: 16px;
}
.remove {
	background-color: indianred;
	color: whitesmoke;
}
</style>

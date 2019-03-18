<template>
	<router-link v-if="href" :to="href" :class="cssClass" :title="getTitle" v-text="text" />
	<button v-else @click.self="click" :class="cssClass" :title="getTitle" v-text="text" />
</template>

<script>
export default {
	data: () => ({
		dic: {
			view: {
				text: '❏',
				title: 'View item'
			},
			edit: {
				text: '✎',
				title: 'Edit item'
			},
			remove: {
				text: '✕',
				title: 'Remove item',
				click(e, table, id) {
					if (id) table.selected.push(id)

					table.remove()
				}
			},
			new: {
				text: 'Add new',
				class: 'hightlight'
			}
		}
	}),
	computed: {
		current() {
			return this.dic[this.type] || {}
		},
		href() {
			if (!this.action.href) return null

			const query = { ...this.$route.query }

			if (typeof this.action.href === 'object')
				return Object.assign({ ...this.action.href }, { params: { id: this.id }, query })

			return null
		},
		text() {
			return this.action.text || this.current.text || this.current.icon
		},
		getTitle() {
			return this.title || this.action.title || this.current.title
		},
		cssClass() {
			return 'btn '.concat(this.type, ' ', this.action.class || this.current.class || '')
		}
	},
	props: {
		id: String,
		type: String,
		title: {
			type: String,
			default: null
		},
		action: {
			type: Object,
			default: () => ({})
		},
		table: {
			type: null,
			default: null
		}
	},
	methods: {
		click(event) {
			const {
				action: { click },
				id,
				table,
				table: { target }
			} = this

			if (table && (click || this.current.click) instanceof Function) {
				;(click || this.current.click).call(target, event, table, id)
			}

			this.$emit('click', event, id, table)
		}
	}
}
</script>

<style scoped>
button,
a {
	padding: 8px 11px;
	font-size: 16px;
	text-decoration: none;
	color: inherit;
	display: inline-block;
}
</style>

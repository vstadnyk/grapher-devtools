<template>
	<td :width="width" :align="align" :valign="valign" :nowrap="nowrap">
		<span v-if="!href && html" v-html="html" />

		{{ !img && !html && !href ? text : null }}

		<img v-if="img && !href && !html" :src="img" class="hide" @load="imgOnLoad" />

		<router-link v-if="href" :to="href">
			<span v-if="html" v-html="html" />

			{{ !html ? text : null }}
		</router-link>

		<p v-for="{ lang, value } in translations" :key="lang">
			<b>{{ lang }}:</b> {{ value }}
		</p>
	</td>
</template>

<script>
import Html from '../../controllers/html'

export default {
	props: {
		value: null,
		width: String,
		nowrap: Boolean,
		align: String,
		id: String,
		valign: {
			type: String,
			default: 'middle'
		},
		link: {
			type: [String, Object],
			default: null
		},
		hook: {
			type: Function,
			default: v => v
		},
		dataType: {
			type: [Object, Function],
			default: null
		}
	},
	computed: {
		href() {
			if (!this.link) return null

			const query = { ...this.$route.query }

			if (typeof this.link === 'object')
				return Object.assign({ ...this.link }, { params: { id: this.id }, query })

			return null
		},
		text() {
			let val = this.value

			if (Array.isArray(this.value)) {
				const { value = undefined } =
					this.value.find(({ lang = null } = {}) => lang === this.$store.getters.lang) ||
					{}

				val = value
			}

			return this.hook.call(this.$parent.$parent, val)
		},
		html() {
			const html = this.hook.call(this.$parent.$parent, this.value)

			if (!html || !html.tagName) return null

			return Html.htmlToString(html)
		},
		img() {
			if (!this.dataType || !this.value || this.dataType.name !== 'Image') return null

			return this.hook.call(this.$parent.$parent, this.value)
		},
		translations() {
			if (!Array.isArray(this.value) || !this.value.find(({ lang }) => lang)) return []

			return this.value.filter(
				({ lang, value }) => value && lang !== this.$store.getters.lang
			)
		}
	},
	methods: {
		imgOnLoad({ target: img }) {
			img.removeAttribute('class')
		}
	}
}
</script>

<style scoped>
a {
	color: inherit;
}
a:hover {
	text-decoration: none;
}
p {
	color: darkgray;
	margin: 3px 0;
}
img {
	max-height: 40px;
}
.hide {
	opacity: 0;
}
</style>

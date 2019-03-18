import Vue from 'vue'

export default class {
	static htmlToString(html) {
		if (!html || !html.tagName) return html

		return document.createElement('div').appendChild(html).outerHTML
	}

	static stringToHtml(str = '', vars = {}, components = {}) {
		if (!/</.test(str.trim())) return str

		Vue.config.silent = false

		const html = Array.from(
			new Vue({
				components,
				data: () => vars,
				template: `<div>${str}</div>`
			}).$mount().$el.children
		)

		if (!html.length) return null

		return html.length === 1 ? html.find(row => row) : html
	}
}

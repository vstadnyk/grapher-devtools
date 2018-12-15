export default class {
	constructor(form) {
		this.form = form
	}

	static getData(form = {}, blackList = ['langSwitcher']) {
		return Array.from(form.elements || this.form.elements)
			.filter(el => el.name)
			.reduce((memo, { name, value, lang = null }) => {
				const obj = { ...memo }

				let val = value

				if (blackList.find(row => row === name)) return obj

				if (value === 'true' || value === 'on') val = true
				if (value === 'false' || value === 'off') val = false

				if (lang) val = !obj[name] ? [{ lang, value }] : obj[name].concat([{ lang, value }])

				obj[name] = val

				return obj
			}, {})
	}

	static arrayToObject(array = []) {
		if (!array.reduce) return array

		return array.reduce(
			(obj, cur) =>
				Object.assign(obj, {
					[cur]: cur
				}),
			{}
		)
	}
}

export default class {
	constructor(form) {
		this.form = form
	}

	static getData(form = {}) {
		return Array.from(form.elements || this.form.elements)
			.filter(el => el.name)
			.reduce(
				(memo, { name, value }) => ({
					...memo,
					[name]: value
				}),
				{}
			)
	}
}

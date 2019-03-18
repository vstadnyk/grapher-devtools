import Label from './Label.vue'

export default {
	components: { Label },
	data: () => ({
		val: null,
		error: null
	}),
	mounted() {
		this.$parent.$on('error', errors => {
			this.error = null

			const { error = null } = errors.find(({ field }) => field === this.name) || {}

			if (error) this.error = error
		})
	},
	computed: {
		formValue() {
			const value = this.val === null && !this.list ? this.value : this.val

			if (!this.lang) return value

			return this.$store.getters.langs.map(lang => ({
				lang,
				value:
					((value || []).find(r => r.lang === lang) || {}).value ||
					((this.value || []).find(r => r.lang === lang) || {}).value ||
					null
			}))
		},
		model: {
			get() {
				if (!this.lang) {
					if (this.val === null) return this.value

					return this.val || undefined
				}

				const { value = undefined } =
					(this.val || []).find(({ lang }) => lang === this.lang) ||
					(this.value || []).find(({ lang }) => lang === this.lang) ||
					{}

				return value
			},
			set(value) {
				if (!this.lang) {
					let val = value

					if (typeof val === 'string' && !Number.isNaN(Number(value)))
						val = parseFloat(value)

					this.val = val
				} else {
					this.val = (this.val || [])
						.concat({ lang: this.lang, value })
						.reduce((a, { lang, value: v }) => {
							const find = a.find(r => r.lang === lang)

							if (find) {
								Object.assign(find, { value: v })

								return a
							}

							return a.concat({ lang, value: v })
						}, [])
				}

				this.$emit('change', this.formValue)
				this.$emit('input', this.formValue)
			}
		},
		bind() {
			const { id, name, type, required, placeholder, disabled } = this

			return {
				id,
				name,
				type,
				required,
				placeholder: required && placeholder ? `* ${placeholder}` : placeholder,
				disabled: disabled === true ? '1' : null
			}
		}
	},
	props: {
		label: {
			type: String,
			default: null
		},
		id: {
			type: String,
			default: null
		},
		type: {
			type: String,
			default: 'text'
		},
		name: {
			type: String,
			default: null
		},
		lang: {
			type: String,
			default: null
		},
		value: {
			type: null,
			default: undefined
		},
		required: {
			type: Boolean,
			default: null
		},
		placeholder: {
			type: String,
			default: null
		},
		disabled: {
			type: Boolean,
			default: null
		}
	}
}

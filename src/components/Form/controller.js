import top from './top.vue'
import tabs from './tabs.vue'
import bottom from './bottom.vue'
import locales from './locales.vue'
import Input from '../Elements/Input.vue'
import Select from '../Elements/Select.vue'
import Checkbox from '../Elements/Checkbox.vue'
import Textarea from '../Elements/Textarea.vue'
import InputPass from '../Elements/InputPass.vue'
import InputImage from '../Elements/InputImage.vue'
import ImageDetails from '../Elements/ImageDetails.vue'

import { getData } from '../../controllers/form'
import api, { I18n } from '../../controllers/api'

export { I18n } from '../../controllers/api'

export default {
	mixins: [api],
	components: {
		top,
		tabs,
		Input,
		Select,
		bottom,
		locales,
		Checkbox,
		Textarea,
		InputPass,
		InputImage,
		ImageDetails
	},
	data() {
		return {
			form: null,
			tab: null,
			lang: null,
			fields: {},
			onErrorGlobal: true,
			$_formController_data: {},
			$_formController_invalid: []
		}
	},
	computed: {
		id() {
			return this.$route.params.id
		},
		langs() {
			return this.$store.getters.langs
		},
		prevRoute() {
			const query = { ...this.$route.query }

			const { matched } = this.$route
			const { path } = matched[matched.length - 2]

			;['tab', 'lang'].forEach(row => {
				delete query[row]
			})

			return { path, query }
		},
		data: {
			get() {
				return this.$data.$_formController_data
			},
			set(data = {}) {
				if (!Object.keys(data || {}).length) {
					this.$set(this.$data, '$_formController_data', {})
				} else {
					Object.entries(data || {}).forEach(([field, value]) => {
						this.$set(this.$data.$_formController_data, field, value)
					})
				}
			}
		},
		$_formController_buildData() {
			const output = { id: this.id, lang: this.lang, input: {} }

			const data = Object.assign(
				{},
				{ ...this.$data.$_formController_data },
				getData(this.form)
			)

			Object.entries(this.fields || {}).forEach(([field, { type, default: def, alias }]) => {
				const value = data[alias || field] === undefined ? def : data[alias || field]

				Object.assign(output.input, { [alias || field]: value ? type(value) : value })
			})

			return output
		}
	},
	created() {
		this.$_formController_merge()

		if (this.query && this.where) this.$_formController_getData(this.query, this.where)
	},
	mounted() {
		this.$on('submit', form => {
			this.form = form || {}

			if (this.submit && this.$_formController_validate())
				this.submit(this.$_formController_buildData)
		})
	},
	methods: {
		$_formController_validate() {
			this.$_formController_invalid = []

			const { input } = this.$_formController_buildData

			for (const [
				field,
				{ type = String, required = false, validation = true }
			] of Object.entries(this.fields || {})) {
				const value = input[field]
				const typeName = (type || String).name.toLowerCase()

				if (!validation) break

				if (value === undefined) {
					this.$_formController_invalid.push({
						field,
						value,
						error: 'Value is undefined'
					})
					break
				}

				if (required && !value) {
					this.$_formController_invalid.push({ field, value, error: 'Field is required' })
					break
				}

				if (typeName === 'number' && !Number.isFinite(value)) {
					this.$_formController_invalid.push({
						field,
						value,
						error: 'Value is not valid Number'
					})
					break
				}

				if (typeName === 'i18n' && !I18n.isValid(value)) {
					this.$_formController_invalid.push({
						field,
						value,
						error: 'Value is not valid I18n scalar type'
					})
					break
				}
			}

			this.$emit('error', this.$_formController_invalid)

			if (this.$_formController_invalid.length) {
				if (this.onErrorGlobal)
					this.$_formController_error({
						type: 'FORM_VALIDATION_ERROR',
						dump: { fields: this.$_formController_invalid }
					})

				return false
			}

			return true
		},
		async $_formController_getData(query, vars, options) {
			const result = await this.$query(query, vars, options)
			const data = Object.values(result || {}).shift()

			if (!data)
				this.$_formController_error({
					message: 'Data not found',
					dump: { vars }
				})

			this.data = data || {}

			return data
		},
		$save(query, vars = null, message = {}) {
			const onSuccess = {
				message: 'Data saved',
				redirect: 1,
				reset: 5000,
				onRedirect: () => this.prevRoute
			}

			if (typeof message === 'string') {
				Object.assign(onSuccess, { message })
			} else {
				Object.assign(onSuccess, message)
			}

			return this.$query(query, vars, { onSuccess })
		},
		$_formController_error(error = {}) {
			return this.$root.$app.$emit(
				'error',
				Object.assign({ type: 'FORM_CONTROLLER' }, new Error(), error)
			)
		},
		$_formController_merge() {
			Object.entries({ ...this.fields }).forEach(([field, { default: def } = {}]) => {
				this.$set(this.$data.$_formController_data, field, def)
			})
		}
	}
}

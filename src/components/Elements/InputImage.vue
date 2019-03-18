<template>
	<div>
		<label v-if="label"> <sup v-if="required && label">*</sup> {{ label }} </label>
		<ImageDetails :src="model" @remove="remove" @click="click" :max="thumbSize" :file="file" />
		<input type="file" @change="change" v-show="false" />
		<textarea v-model="model" :name="name" :required="required" v-show="false" />
	</div>
</template>

<script>
import ImageController from '../../controllers/image'
import ImageDetails from './ImageDetails.vue'

export default {
	components: { ImageDetails },
	data: () => ({
		val: null,
		file: null
	}),
	computed: {
		input() {
			return this.$el.querySelector('[type="file"]')
		},
		model: {
			get() {
				if (this.val === 'reset') return null

				return this.val || this.value
			},
			set(val) {
				if (!val || val === 'reset') {
					this.val = val
					this.$emit('change', null)
					this.$emit('input', null)
				} else {
					const {
						file: { type: mime },
						maxWidth,
						maxHeight
					} = this

					const image = ImageController.base64ToImage(val)

					image.onload = ({ target }) => {
						this.val = ImageController.compress(target, {
							maxWidth,
							maxHeight,
							mime
						}).src

						this.$emit('change', this.val)
						this.$emit('input', this.val)
					}
				}
			}
		}
	},
	methods: {
		change({ target: { files } }) {
			const reader = new FileReader()

			this.file = Array.from(files)
				.filter(blob => blob instanceof Blob)
				.find(row => row)

			reader.readAsDataURL(this.file)

			reader.onloadend = ({ target: { result } }) => {
				this.model = result
			}
		},
		remove() {
			this.model = 'reset'
			this.input.value = ''
			this.$emit('change', null)
			this.$emit('input', null)
		},
		click() {
			this.input.click()
		}
	},
	props: {
		label: {
			type: String,
			default: null
		},
		name: {
			type: String,
			default: null
		},
		value: {
			type: null,
			default: null
		},
		maxWidth: {
			type: Number,
			default: 1920
		},
		maxHeight: {
			type: Number,
			default: 1080
		},
		thumbSize: {
			type: String,
			default: '234px'
		},
		required: {
			type: Boolean,
			default: null
		}
	}
}
</script>

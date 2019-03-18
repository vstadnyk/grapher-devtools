<template>
	<section>
		<section v-bind:style="style" @click="$emit('click', $event.target)">
			<i v-if="!value">No image</i>
		</section>
		<div v-if="value">
			<p>
				<b>Link:</b>
				<a
					:href="value"
					v-text="value"
					@click.prevent="link"
					target="_blank"
					v-bind:style="linkStyle"
				/>
			</p>
			<p><b>Size:</b> {{ width }}x{{ height }}</p>
			<p><b>Filesize:</b> {{ (size / 1024).toFixed(3) }} kb</p>
			<p><b>Mime:</b> {{ mime }}</p>
			<p align="right">
				<button class="btn red" type="button" @click="remove">Remove</button>
			</p>
		</div>
	</section>
</template>

<script>
import ImageController from '../../controllers/image'

export default {
	data: () => ({
		loader: '/loader.svg',
		value: null,
		image: null,
		width: null,
		height: null,
		mime: null,
		size: null
	}),
	computed: {
		linkStyle() {
			return {
				maxWidth: (parseInt(this.max, 0) - 50).toString().concat('px')
			}
		},
		style() {
			const style = { height: this.max, width: this.max }

			if (this.value) Object.assign(style, { backgroundImage: `url(${this.value})` })

			if (!!this.src && !this.height)
				Object.assign(style, { backgroundImage: `url(${this.loader})` })

			return style
		}
	},
	methods: {
		async setThumb(src) {
			if (src) {
				const image = new Image()

				image.src = src

				image.onload = ({ target: { height = 0, width = 0 } }) => {
					this.value = image.src

					this.height = height
					this.width = width
				}

				const { type, size } =
					this.file || (await new ImageController().fetchFileToBlob(src))

				this.size = size
				this.mime = type
			}
		},
		remove() {
			this.value = null

			this.$emit('remove')
		},
		link({ target: { href } }) {
			const { width: w, height: h } = this

			const params = [
				`width=${w}`,
				`height=${h}`,
				'top=210',
				'left=210',
				'resizable',
				'scrollbars',
				'status'
			]

			const tab = window.open('', '', params.join(','))
			tab.document.body.innerHTML = `<img src="${href}">`
		}
	},
	watch: {
		src(src) {
			this.setThumb(src)
		}
	},
	props: {
		src: String,
		max: {
			type: String,
			default: '234px'
		},
		file: {
			type: File,
			default: null
		}
	}
}
</script>

<style scoped>
section {
	text-align: center;
}
section > section {
	display: inline-flex;
	position: relative;
	border: 1px solid #ccc;
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	justify-content: center;
	align-items: center;
	color: #888;
}
div {
	background: rgba(0, 0, 0, 0.2);
	font-size: 11px;
	padding: 10px;
	text-align: left;
}
p {
	margin: 0;
}
p:not([align]) {
	margin: 5px 0;
	vertical-align: top;
}
b,
a {
	vertical-align: top;
}
a {
	display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin-left: 5px;
}
</style>

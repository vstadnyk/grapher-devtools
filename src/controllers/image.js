export default class {
	static compress(
		img,
		{
			width = 0,
			height = 0,
			maxWidth = null,
			maxHeight = null,
			ratio = 1,
			mime = 'image/jpeg',
			quality = 0.8,
			background = 'white'
		} = {}
	) {
		const canvas = document.createElement('canvas')

		const { width: w = 0, height: h = 0 } = this.ratio({
			width: width || img.width,
			height: height || img.height,
			maxWidth,
			maxHeight,
			ratio
		})

		canvas.width = w
		canvas.height = h

		const ctx = canvas.getContext('2d')

		if (background) {
			ctx.fillStyle = background
			ctx.fillRect(0, 0, w, h)
		} else {
			ctx.fillRect(40, 60, w, h)
		}

		const image = new Image()

		image.src = img.src
		image.setAttribute('crossOrigin', 'anonymous')

		ctx.drawImage(image, 0, 0, w, h)

		image.src = canvas.toDataURL(mime, quality)

		return image
	}

	static ratio(
		data = {
			width: 0,
			height: 0,
			maxWidth: 0,
			maxHeight: 0,
			ratio: 1
		}
	) {
		const { maxWidth, maxHeight } = data

		if (maxWidth || maxHeight) {
			const { width: w, height: h } = data
			const i = w / h

			if (w && maxWidth && w > maxWidth)
				Object.assign(data, { width: maxWidth, height: maxWidth / i })

			if (h && maxHeight && h > maxHeight)
				Object.assign(data, { height: maxHeight, width: maxHeight * i })
		}

		const { width: w, height: h, ratio: r = 1 } = data

		if (!h || h > w / r) Object.assign(data, { height: w / r })
		if (!w || w > w * r) Object.assign(data, { width: h * r })

		return data
	}

	static base64ToFile(base64, filename) {
		const arr = base64.split(',')
		const mime = arr[0].match(/:(.*?);/)[1]
		const bstr = atob(arr[1])

		const n = bstr.length
		const u8arr = new Uint8Array(n)

		new Array(n).fill(0).forEach((v, i) => {
			u8arr[i] = bstr.charCodeAt(i)
		})

		return new File([u8arr], filename, { type: mime })
	}

	static imageToFile(img, filename = null) {
		const base64 = this.imageToBase64(img)
		const ext = this.base64GetExtension(base64)

		return this.base64ToFile(base64, filename || 'image.'.concat(ext))
	}

	async fetchFileToBlob(url) {
		try {
			const responce = await fetch(url, { mode: 'cors' })
			const blob = await responce.blob()

			return blob
		} catch (error) {
			console.error(error)

			return null
		}
	}

	static base64ToImage(src) {
		const image = new Image()

		image.setAttribute('crossOrigin', 'anonymous')

		image.src = src

		return image
	}

	static srcGetExtension(src) {
		return (
			src
				.split('.')
				.pop()
				.split(/#|\?/)
				.find(r => r) || null
		)
	}

	static srcGetMime(src) {
		return Object.entries({
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			gif: 'image/gif',
			tif: 'image/tiff',
			tiff: 'image/tiff',
			webp: 'image/webp',
			ico: 'image/x-icon'
		})
			.map(([i, v]) => (i === this.srcGetExtension(src) ? v : null))
			.find(r => r)
	}

	static imageToBase64(img) {
		const { height, width, src } = img
		const mime = this.srcGetMime(src)

		const image = new Image()

		image.setAttribute('crossOrigin', 'anonymous')
		image.src = src

		const canvas = document.createElement('canvas')

		canvas.width = width
		canvas.height = height

		const ctx = canvas.getContext('2d')

		ctx.drawImage(image, 0, 0)

		return canvas.toDataURL(mime)
	}

	static base64GetMime(str = '') {
		const mime = str.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)

		if (!mime || !mime.length) return null

		return mime[1]
	}

	static base64GetExtension(str = '') {
		const mime = this.base64GetMime(str)

		if (!mime) return null

		return mime.split('/').pop()
	}

	static base64ToBuffer(str = '') {
		if (typeof str !== 'string') return this

		const mime = this.base64GetMime(str)

		if (!mime) return null

		return {
			mime,
			ext: this.base64GetExtension(str),
			buffer: Buffer.from(str.replace(/^data:image\/\w+;base64,/, ''), 'base64')
		}
	}
}

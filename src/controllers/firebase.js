import { firebase as config } from '../../config'

export default class {
	get version() {
		return config.version
	}

	get path() {
		return config.path
	}

	get apps() {
		return config.apps || []
	}

	get VapidKey() {
		return config.VapidKey || null
	}

	get initialize() {
		return config.initialize || {}
	}

	get messaging() {
		return window.firebase.messaging()
	}

	use(app) {
		if (!this.app && app.$options) this.app = app

		return this
	}

	async script(src) {
		return new Promise((resolve, reject) => {
			const script = document.createElement('SCRIPT')

			script.setAttribute('src', src)

			script.addEventListener('load', e => {
				resolve(e, src)
			})

			script.addEventListener('error', e => {
				reject(e)
			})

			document.head.appendChild(script)
		})
	}

	async init() {
		if (!window.firebase) {
			const { path, version, apps } = this

			for (const app of apps) {
				const src = [path, version, app].join('/')

				try {
					await this.script(src) // eslint-disable-line
				} catch (error) {
					throw this.error('Load script', src)
				}
			}
		}

		if (!window.firebase.apps.length) {
			window.firebase.initializeApp(this.initialize)

			await this.checkPermission()

			await this.registerServiceWorker()

			this.messaging.usePublicVapidKey(this.VapidKey)
		}

		return window.firebase
	}

	async registerServiceWorker() {
		try {
			const sw = await navigator.serviceWorker.register(config.sw)

			this.messaging.useServiceWorker(sw)
		} catch (error) {
			throw this.error(`Unable to register service worker "${config.sw}"`, error)
		}
	}

	async checkPermission() {
		try {
			await this.messaging.requestPermission()
		} catch (error) {
			throw this.error('Unable to get permission', error)
		}
	}

	async getToken() {
		if (this.app) this.app.$emit('loader', 'start')

		try {
			await this.init()

			const token = await this.messaging.getToken()

			if (this.app) this.app.$emit('loader', 'done')

			return token
		} catch (error) {
			const err = this.error('Unable to get token', error)

			if (this.app) return this.app.$emit('error', err)

			throw err
		}
	}

	error(message, dump) {
		return Object.assign({}, new Error(), { type: 'FIREBASE_ERROR', dump, message })
	}
}

import { api as config } from '../../config'

export default class {
	static get config() {
		return config
	}

	static getHeaders() {
		const headers = {}

		Object.entries(config.headers).forEach(([key, value]) => {
			if (!localStorage.getItem(key) && value) localStorage.setItem(key, value)

			Object.assign(headers, { [key]: localStorage.getItem(key) })
		})

		return headers
	}

	static get url() {
		const { host, ports } = config
		const { protocol, hostname } = window.location

		return '//'.concat(
			hostname === host ? host : hostname,
			':',
			ports[protocol.replace(':', '')]
		)
	}

	static get uri() {
		return this.url.concat(config.url)
	}

	static get protocol() {
		return window.location.protocol
	}

	static get wsUri() {
		return (this.protocol === 'https:' ? 'wss:' : 'ws:').concat(this.uri)
	}
}

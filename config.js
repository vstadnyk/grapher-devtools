export const api = {
	host: 'localhost',
	url: '/api',
	ports: {
		http: 3000,
		https: 3443
	},
	headers: {
		Apptype: 'admin',
		Applang: 'en',
		Appplatform: 'web',
		Authorization: null
	},
	ws: {
		reconnect: false,
		reconnectionAttempts: 5,
		timeout: 10000
	}
}

export const ping = {
	intervals: {
		token: 3000
	}
}

export default {
	api,
	ping
}

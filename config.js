export const api = {
	host: 'localhost',
	url: '/api',
	ports: {
		http: 3000,
		https: 3443
	},
	headers: {
		apptype: 'admin',
		applang: 'en',
		appplatform: 'web',
		authorization: null
	},
	ws: {
		reconnect: true,
		reconnectionAttempts: 3,
		timeout: 10000
	}
}

export const ping = {
	intervals: {
		server: 30000,
		token: 30000
	}
}

export default {
	api,
	ping
}

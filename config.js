export const server = {
	host: 'localhost',
	ports: { http: 3000, https: 3443 }
}

export const api = {
	path: '/api',
	headers: {
		apptype: 'dev',
		applang: 'en',
		appplatform: 'web',
		authorization: null
	}
}

export const user = { pingToken: 50000 }

export const firebase = {
	version: '5.9.0',
	path: 'https://www.gstatic.com/firebasejs',
	apps: ['firebase-app.js', 'firebase-messaging.js'],
	sw: 'firebase-sw.js', // path to serviceWorker file
	initialize: {
		apiKey: 'AIzaSyBB6d7LXbXp2YbPXLAEjUiFhTgE9GQ7ptM',
		authDomain: 'grapher-server-demo.firebaseapp.com',
		databaseURL: 'https://grapher-server-demo.firebaseio.com',
		projectId: 'grapher-server-demo',
		storageBucket: 'grapher-server-demo.appspot.com',
		messagingSenderId: '324211605419'
	},
	VapidKey:
		'BBcx3Lzau7A4FeAUHfKJPbL7LoXoLWBtW6BOtSHEh-blirX2xVr0D1fyEgjT1z7l6H5tnFth-4W7QMGBkeCPnwQ'
}

export default {}

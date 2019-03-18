/* eslint-disable */

importScripts('https://www.gstatic.com/firebasejs/5.9.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.9.0/firebase-messaging.js')

firebase.initializeApp({ messagingSenderId: '324211605419' })

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(payload => {
	return self.registration.showNotification(payload.data.title, {
		body: payload.data.body
	})
})

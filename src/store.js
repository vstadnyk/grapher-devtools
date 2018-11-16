import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		isLogin: null,
		isOnline: true,
		user: null,
		serverTime: null
	},
	mutations: {
		login(state, data = null) {
			if (!data) return

			const {
				tokens: { accessToken, refreshToken },
				user
			} = data

			if (accessToken) localStorage.setItem('authorization', accessToken)
			if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

			Object.assign(state, { user, isLogin: true })
		},
		logout(state) {
			localStorage.removeItem('authorization')
			localStorage.removeItem('refreshToken')

			Object.assign(state, { user: null, isLogin: null })
		},
		refreshToken(state, { accessToken, refreshToken } = {}) {
			if (accessToken) localStorage.setItem('authorization', accessToken)
			if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

			Object.assign(state, { isLogin: !!accessToken })
		},
		isLogin(state, isLogin = null) {
			Object.assign(state, { isLogin })
		},
		isOnline(state, isOnline = null) {
			Object.assign(state, { isOnline })
		},
		setUser(state, user) {
			Object.assign(state, { user })
		},
		setServerTime(state, serverTime) {
			Object.assign(state, { serverTime })
		}
	},
	actions: {}
})

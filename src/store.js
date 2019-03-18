/* eslint-disable no-param-reassign */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: null,
		userRulesList: null,
		instance: null,
		serverTime: null,
		serverLogerConfig: null,
		serverLocales: null,
		pushTemplateData: null,
		userPermissions: null,
		mailConfig: null,
		locationConfig: null,
		requestsPending: [],
		requests: []
	},
	getters: {
		userCan: ({ userRulesList: rules = [] }) => arg => {
			const rule = Array.isArray(arg) ? arg : [arg]
			const filter = (rules || []).filter(row => rule.find(r => row.value && r === row.rule))

			if (!filter.length) return false
			if (filter.length !== rule.length) return false

			return true
		},
		authToken: ({ user = {} }) => (token = 'accessToken') => (user || {})[token] || null,
		lang(state = {}) {
			const { default: def = 'en' } = state.serverLocales || {}

			return def
		},
		langs(state = {}) {
			const { default: def = 'en', active } = state.serverLocales || {}

			return active || [def]
		},
		langsAsObject(state = {}) {
			const { default: def = 'en', active } = state.serverLocales || {}

			return Object.assign(...(active || [def]).map(l => ({ [l]: l })))
		},
		apptypes(state = {}) {
			return (state.instance || {}).apptype
		},
		appplatforms(state = {}) {
			return (state.instance || {}).appplatform
		},
		userPermissionsList(state = {}) {
			return Object.assign(
				{},
				...Object.entries(state.userPermissions || {}).map(([alias, { id, name }]) => ({
					[id]: name || alias
				}))
			)
		},
		userPermissionsListAlias(state = {}) {
			return Object.assign(
				{},
				...Object.entries(state.userPermissions || {}).map(([alias, { name }]) => ({
					[alias]: name || alias
				}))
			)
		}
	},
	mutations: {
		setUserRules: (state, data) => {
			state.userRulesList = data
		},
		setData(state, data) {
			Object.assign(state, data || {})
		},
		setRequestLog(state, data = {}) {
			state.requestsPending.push(Object.assign({ ...data }, { start: new Date().getTime() }))
		},
		updateRequestLog(state, { id, error = null, result }) {
			const request = state.requestsPending.find(row => row.id === id)

			state.requestsPending.splice(state.requestsPending.indexOf(request), 1)

			if (request) {
				state.requests.push(
					Object.assign({ ...request }, { error, result, finish: new Date().getTime() })
				)
			}
		},
		login(state, user) {
			state.user = user
		},
		logout(state) {
			state.user = null
		},
		setInstance(state, instance) {
			state.instance = instance
		},
		setServerTime(state, serverTime) {
			state.serverTime = serverTime
		},
		setServerLocales(state, serverLocales) {
			state.serverLocales = serverLocales
		},
		setPushTemplateData(state, pushTemplateData) {
			state.pushTemplateData = pushTemplateData
		},
		setUserPermissions(state, userPermissions) {
			state.userPermissions = userPermissions
		},
		setMailConfig(state, mailConfig) {
			state.mailConfig = mailConfig
		},
		setLocationConfig(state, locationConfig) {
			state.locationConfig = locationConfig
		},
		setServerLogerConfig(state, serverLogerConfig) {
			state.serverLogerConfig = serverLogerConfig
		}
	},
	actions: {
		clearRequestsLog({ state }) {
			Object.assign(state, {
				requestsPending: [],
				requests: []
			})
		}
	}
})

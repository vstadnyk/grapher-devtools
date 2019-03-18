import {
	CurrentUser,
	User as query,
	AuthTokenInfo,
	GetUserIDByRid,
	GetUserIDByMail
} from '../graphql/User.gql'

import api from './api'

export default class {
	$graphql(...args) {
		const {
			methods: { $graphql }
		} = api

		return $graphql.call(this.app, ...args)
	}

	$query(...args) {
		const {
			methods: { $query }
		} = api

		return $query.call(this.app, ...args)
	}

	async current() {
		if (!this.user) {
			try {
				const { user = {} } = (await this.$graphql(CurrentUser)) || {}

				this.user = user

				this.app.$store.commit('setUser', user)
			} catch (error) {
				this.user = null

				this.app.$store.commit('setUser', {})
			}
		}

		return this.user
	}

	async one(input = {}) {
		const { user = null } = (await this.$graphql(query, { input })) || {}

		return user
	}

	can(arg) {
		if (arg === undefined) return true

		const rule = Array.isArray(arg) ? arg : [arg]

		const { permission = {} } = this.app.$store.state.user || {}

		const { rules = {} } = permission || {}

		const filter = Object.keys(rules || {}).filter(row => rule.find(r => r === row))

		if (!filter.length || filter.length !== rule.length) return false

		return true
	}

	use(app) {
		if (!this.app && app.$options) this.app = app

		return this
	}

	async getByToken(token) {
		const { tokenInfo: result } = (await this.$query(AuthTokenInfo, { token })) || {}

		if (!result)
			return this.app.$emit('error', {
				type: 'TOKEN_NOT_VALID',
				message: 'Token is not valid',
				dump: { token }
			})

		const { rid = null, mail = null } = result || {}

		const { user = {} } =
			(await this.$query(rid ? GetUserIDByRid : GetUserIDByMail, rid ? { rid } : { mail })) ||
			{}

		const { id = null } = user || {}

		return Object.assign({ user: user || undefined }, { id }, result)
	}
}

import { print } from 'graphql/language/printer'

import { url } from './server'
import { api as config } from '../../config'

const { path } = config

export const I18n = (value = []) => {
	I18n.isValid = () => {
		if (value === null) return true

		if (!Array.isArray(value)) return false
		if (!value.length) return false

		if (
			!value.some(obj =>
				Object.keys(obj || {}).some(key => key === 'lang' || key === 'value')
			)
		)
			return false

		return true
	}

	return value
}

export const uri = url.concat(path)

export const formatError = ({
	message,
	status = 404,
	type = 'NETWORK_ERROR',
	errors,
	dump = null
}) => Object.assign(new Error(), { message, type, status, errors, dump })

export const getOperationName = ast => {
	const { name: { value = null } = {} } =
		(ast.definitions || []).find(({ kind }) => kind === 'OperationDefinition') || {}

	return value
}

export const run = async (ast = {}, variables = {}, headers = {}) => {
	try {
		if (!(ast instanceof Object))
			throw formatError({
				type: 'SCHEMA_VALIDATION_FAILED',
				message: 'Query is not an Object',
				dump: { query: ast }
			})

		const body = { variables }

		try {
			Object.assign(body, { query: print(ast), operationName: getOperationName(ast) })
		} catch ({ message }) {
			throw formatError({ type: 'GRAPHQL_VALIDATION_FAILED', message, dump: { query: ast } })
		}

		const response = await fetch(uri, {
			method: 'post',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Accept-Encoding': 'gzip',
				...(config.headers || {}),
				...headers
			}),
			cache: 'default',
			body: JSON.stringify(body)
		})

		const { data = {}, errors = [] } = (await response.json()) || {}

		if (errors.length) {
			if (errors.length === 1) {
				throw formatError(errors.find(row => row))
			} else {
				throw formatError({
					type: 'MILTIPLE_ERRORS',
					message: 'Multiple errors',
					errors
				})
			}
		}

		return data
	} catch (error) {
		throw formatError(error)
	}
}

export const isMutation = ({ definitions = [] }) =>
	definitions.some(({ operation }) => operation === 'mutation')

export const getQueryInfo = ({ definitions = [] }, variables = {}) => {
	const {
		operation = 'error',
		name: { value: name = 'MILTIPLE_ERRORS' } = {},
		variableDefinitions = []
	} = definitions.find(({ kind }) => kind === 'OperationDefinition') || {}

	return {
		id: new Date()
			.getTime()
			.toString()
			.concat(operation, name),
		operation,
		name,
		variableDefinitions,
		variables
	}
}

export default {
	methods: {
		async $graphql(query = {}, variables = {}) {
			const log = getQueryInfo(query, variables)

			this.$store.commit('setRequestLog', log)

			try {
				const result = await run(query, variables, {
					authorization: this.$store.getters.authToken()
				})

				this.$store.commit('updateRequestLog', { id: log.id, result })

				return result
			} catch (error) {
				const { type, message, dump, errors } = error

				this.$store.commit('updateRequestLog', {
					id: log.id,
					error: { type, message, errors, dump }
				})

				throw error
			}
		},
		async $query(
			query = {},
			variables = {},
			{ before = {}, onSuccess = {}, onError = {} } = {}
		) {
			this.$root.$app.$emit('before', before)

			try {
				const result = await this.$graphql(query, variables)

				this.$root.$app.$emit('success', onSuccess)

				return result
			} catch (error) {
				this.$root.$app.$emit('error', error, onError)

				return null
			}
		}
	}
}

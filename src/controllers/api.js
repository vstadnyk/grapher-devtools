// https://github.com/f/graphql.js
import graphql from 'graphql.js'
import { print } from 'graphql/language/printer'

import Server from './server'

const { uri, protocol, getHeaders } = Server

export default class {
	constructor() {
		this.fragments = {}
	}

	get graph() {
		const { fragments } = this

		return graphql(uri, {
			headers: getHeaders(),
			fragments
		})
	}

	async run({ query = null, mutation = null, variables = null }) {
		const ast = query || mutation || {}
		const { definitions } = ast

		const fragments = definitions.filter(({ kind }) => kind === 'FragmentDefinition')

		if (fragments.length) {
			fragments.forEach(row => {
				Object.assign(this.fragments, {
					[row.name.value]: print(row).replace(`fragment ${row.name.value}`, '')
				})
			})
		}

		try {
			const result = await this.graph(
				print(
					Object.assign({}, ast, {
						definitions: definitions.filter(({ kind }) => kind !== 'FragmentDefinition')
					})
				)
			)(variables)

			return result
		} catch (error) {
			throw this.error(Array.isArray(error) ? { errors: error } : error)
		}
	}

	async query(args, vars = null) {
		const { query = null, variables = null } = args

		const result = await this.run({ query: query || args, variables: vars || variables })

		return result
	}

	async mutate(args, vars = null) {
		const { mutation = null, variables = null } = args

		const result = await this.run({ mutation: mutation || args, variables: vars || variables })

		return result
	}

	error({
		message = 'Internal',
		type = 'INTERNAL_ERROR',
		response = null,
		status = 'OK',
		errors = null,
		stack = null
	}) {
		const error = {
			message,
			type,
			errors,
			status,
			stack,
			response
		}

		if (errors)
			Object.assign(error, {
				type: errors.map(({ type: row }) => row).join(' '),
				message: errors.map(row => `${row.type}: ${row.message}`).join(', ')
			})

		if (response)
			Object.assign(error, { message: `NETWORK_ERROR: ${status}`, type: 'NETWORK_ERROR' })

		if (status === 0)
			Object.assign(error, {
				message: `CONNECTION_FAILED: '${protocol.concat(uri)}'`,
				type: 'CONNECTION_FAILED'
			})

		return Object.assign(new Error(), error)
	}
}

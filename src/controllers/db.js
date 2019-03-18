/* eslint-disable no-underscore-dangle */

export class DB {
	constructor(name, version) {
		this.name = name
		this.version = version
	}

	init(schema = {}) {
		this.schema = schema || {}

		this.connect = this._connect()

		return Object.assign(
			...Object.keys(schema || {}).map(table => ({
				[table]: {
					add: data => this._add(data, table),
					put: data => this._put(data, table),
					get: where => this._get(where, table),
					remove: where => this._remove(where, table)
				}
			}))
		)
	}

	_request(request) {
		return new Promise((resolve, reject) => {
			request.onsuccess = ({ target: { result } }) => {
				resolve(result)
			}

			request.onerror = ({ target: { error } }) => {
				reject(error)
			}
		})
	}

	_addTable(db, table, options = { keyPath: 'id' }, indexes) {
		if (!db.objectStoreNames.contains(table)) {
			const store = db.createObjectStore(table, options)

			Object.entries(indexes || {}).forEach(([field, option]) => {
				store.createIndex(field, field, option)
			})
		}
	}

	async _connect() {
		const request = window.indexedDB.open(this.name, this.version)

		return new Promise((resolve, reject) => {
			request.onupgradeneeded = ({ target: { result: db } }) => {
				Object.entries(this.schema).forEach(([table, { options, indexes }]) => {
					this._addTable(db, table, options, indexes)
				})
			}

			request.onsuccess = ({ target: { result: db } }) => {
				resolve(db)
			}

			request.onerror = ({ target: { error } }) => {
				reject(error)
			}
		})
	}

	async _table(table, mode = 'readwrite') {
		try {
			const connect = await this.connect

			return connect.transaction(table, mode).objectStore(table)
		} catch (error) {
			throw this.error(error, { table })
		}
	}

	async _get(where, table) {
		const store = await this._table(table)

		if (!store) return null

		if (where) return this._request(store.get(where))

		const rows = []

		const request = store.openCursor()

		try {
			const result = await new Promise((resolve, reject) => {
				request.onsuccess = ({ target: { result: cursor } }) => {
					if (cursor) {
						rows.push(cursor.value)
						cursor.continue()
					} else {
						resolve(rows)
					}
				}

				request.onerror = ({ target: { error } }) => {
					reject(error)
				}
			})

			if (!result.length) return null

			if (result.length === 1) return result.find(row => row)

			return result
		} catch (error) {
			throw this.error(error, { table })
		}
	}

	async _add(data, table) {
		const store = await this._table(table, 'readwrite')

		if (!store) return null

		try {
			const id = await this._request(store.add(data))

			return id
		} catch (error) {
			throw this.error(error, { table })
		}
	}

	async _put(data, table) {
		const store = await this._table(table, 'readwrite')

		if (!store) return null

		try {
			const id = await this._request(store.put(data))

			return id
		} catch (error) {
			throw this.error(error, { table })
		}
	}

	async _remove(where, table) {
		const store = await this._table(table, 'readwrite')

		if (!store) return null

		try {
			await this._request(store.delete(where))

			return true
		} catch (error) {
			throw this.error(error, { table })
		}
	}

	error({ message }, dump = {}) {
		return Object.assign(new Error(), { message, type: 'INDEXED_DB_ERROR', dump })
	}
}

export const schema = {
	user: {
		options: {
			keyPath: 'id'
		}
	},
	userRules: {
		options: {
			keyPath: 'rule'
		},
		indexes: {
			rule: {
				unique: true
			}
		}
	}
}

export default {
	created() {
		this.$db = new DB('grapher', 1).init(schema)
	}
}

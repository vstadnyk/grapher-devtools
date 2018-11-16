export default class {
	static format({ graphQLErrors = [], networkError = null }, field = 'message') {
		if (networkError) return 'Network error'

		return graphQLErrors
			.filter(row => row[field])
			.map(row => row[field])
			.join('\n')
	}
}

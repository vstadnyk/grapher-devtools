import Vue from 'vue'
import VueApollo from 'vue-apollo'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'

import Server from './controllers/server'

const {
	uri,
	wsUri,
	getHeaders,
	config: { ws: wsConfig }
} = Server

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query)

		return kind === 'OperationDefinition' && operation === 'subscription'
	},
	new WebSocketLink({
		uri: wsUri,
		options: wsConfig
	}),
	new HttpLink({
		uri,
		headers: getHeaders()
	})
)

Vue.use(VueApollo)

export default new VueApollo({
	defaultClient: new ApolloClient({
		link: setContext(() => ({ headers: getHeaders() })).concat(link),
		cache: new InMemoryCache(),
		connectToDevTools: true
	}),
	defaultOptions: {
		$loadingKey: 'loading'
	},
	errorHandler(error) {
		console.log('Global error handler')
		console.error(error)
	}
})

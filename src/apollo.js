import Vue from 'vue'
import VueApollo from 'vue-apollo'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import { url, endpointPorts } from '../graphql.config'

const { hostname, protocol } = window.location

const uri = '//'.concat(hostname, ':', endpointPorts[protocol.replace(':', '')], url)
const wsUri = (protocol === 'https:' ? 'wss:' : 'ws:').concat(uri)

Vue.use(VueApollo)

export default new VueApollo({
	defaultClient: new ApolloClient({
		link: split(
			({ query }) => {
				const { kind, operation } = getMainDefinition(query)

				return kind === 'OperationDefinition' && operation === 'subscription'
			},
			new WebSocketLink({
				uri: wsUri,
				options: { reconnect: true }
			}),
			new HttpLink({ uri })
		),
		cache: new InMemoryCache(),
		connectToDevTools: true
	}),
	defaultOptions: {
		$loadingKey: 'loading'
	}
})

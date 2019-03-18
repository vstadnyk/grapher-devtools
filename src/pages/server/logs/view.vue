<template>
	<viewer v-bind="viewer" />
</template>

<script>
import Viewer from '../../../components/Viewer.vue'
import { ViewLogRow as query } from '../../../graphql/Logs.gql'

export default {
	components: { Viewer },
	computed: {
		viewer() {
			return {
				query,
				variables: {
					type: this.type,
					date: this.$route.params.id
				},
				dataHook({ rows }) {
					return rows.shift()
				}
			}
		}
	},
	props: {
		type: {
			type: String,
			default: 'errors'
		}
	}
}
</script>

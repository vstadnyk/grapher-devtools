<template>
	<data-viewer :query="query" />
</template>

<script>
import dataViewer from '../../components/Viewer.vue'

import { GetUserByID as query } from '../../graphql/User.gql'

export default {
	components: { dataViewer },
	data: () => ({ query })
}
</script>

<template>
	<data-viewer :query="query" />
</template>

<script>
import dataViewer from '../../../components/Viewer.vue'

import { Config as query } from '../../../graphql/Config.gql'

export default {
	components: { dataViewer },
	data: () => ({ query })
}
</script>

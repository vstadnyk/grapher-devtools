<template>
	<data-viewer v-bind="viewer" />
</template>

<script>
import dataViewer from '../../../components/Viewer.vue'

import { PushTemplate as query } from '../../../graphql/Push.gql'

export default {
	components: { dataViewer },
	data: () => ({ viewer: { query } })
}
</script>

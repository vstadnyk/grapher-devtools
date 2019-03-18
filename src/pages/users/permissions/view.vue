<template>
	<viewer v-bind="viewer" />
</template>

<script>
import viewer from '../../../components/Viewer.vue'

import { UserPermission as query } from '../../../graphql/UserPermission.gql'

export default {
	components: { viewer },
	data: () => ({ viewer: { query } })
}
</script>

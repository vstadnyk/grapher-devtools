<template>
	<viewer v-bind="viewer" />
</template>

<script>
import viewer from '../../../components/Viewer.vue'

import { MailTemplate as query } from '../../../graphql/Mail.gql'

export default {
	components: { viewer },
	data: () => ({ viewer: { query } })
}
</script>

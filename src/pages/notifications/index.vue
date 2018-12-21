<template>
	<section>
		<p v-if="error" v-text="error" class="error" />
		<router-view />
	</section>
</template>

<script>
import { PushData } from '../../graphql/Push.gql'

export default {
	data: () => ({
		error: null
	}),
	watch: {
		$route() {
			this.error = null
		}
	},
	created() {
		this.$on('error', error => {
			this.error = (error.type || '').concat(': ', error.message)

			console.error(error)

			this.$parent.$emit('loader', 'done')
		})
	},
	methods: {
		async getData() {
			this.$root.$app.$emit('loader', 'start')

			try {
				const { pushTemplateData } = await this.$api.query(PushData)

				this.$root.$app.$emit('loader', 'done')

				this.$store.commit('setPushTemplateData', pushTemplateData)
			} catch (error) {
				this.$parent.$emit('error', error)
			}
		}
	}
}
</script>

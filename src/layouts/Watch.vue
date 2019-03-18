<template>
	<section>
		<div>
			<h2 v-text="time" />
			<h4 v-text="date" />
		</div>
	</section>
</template>

<script>
import moment from 'moment'
import api from '../controllers/api'
import { ServerTime as query } from '../graphql/Info.gql'

export default {
	mixins: [api],
	data: () => ({ queryTime: null, timer: null }),
	computed: {
		serverTime() {
			return this.queryTime || this.$store.state.serverTime
		},
		time() {
			return moment(this.serverTime || new Date()).format('HH:mm:ss')
		},
		date() {
			return moment(this.serverTime || new Date()).format('ddd, DD MMMM YYYY')
		}
	},
	async created() {
		clearInterval(this.timer)

		try {
			const { serverInfo = {} } = (await this.$graphql(query)) || {}

			this.queryTime = (serverInfo || {}).dateTime || null

			this.$store.commit('setServerTime', this.queryTime)

			this.timer = setInterval(() => {
				if (this.serverTime)
					this.$store.commit(
						'setServerTime',
						moment(this.serverTime)
							.add(1, 'seconds')
							.format('YYYY-MM-DD HH:mm:ss')
					)
			}, 1000)
		} catch (error) {
			console.error(error)
		}
	}
}
</script>

<style scoped>
section {
	border-top: 1px solid #ccc;
	color: #a0a0a0;
	text-align: center;
	padding: 10px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	overflow: hidden;
}
section div > * {
	margin: 0;
}
h2 {
	font-size: 18px;
}
h4 {
	font-size: 10px;
}
</style>

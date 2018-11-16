<template>
	<section>
		<div>
			<h2>{{ time }}</h2>
			<h4>{{ date }}</h4>
		</div>
	</section>
</template>

<script>
import moment from 'moment'
import { ServerTime as query } from '../graphql/Info.gql'

export default {
	name: 'Watch',
	data: () => ({
		timer: null
	}),
	computed: {
		time() {
			return moment(this.$store.state.serverTime).format('HH:mm:ss')
		},
		date() {
			return moment(this.$store.state.serverTime).format('ddd, DD MMMM YYYY')
		}
	},
	async created() {
		clearInterval(this.$parent.serverTimeInterval)

		try {
			const {
				data: { serverInfo }
			} = await this.$apollo.query({
				query
			})

			this.$store.commit('setServerTime', serverInfo.dateTime)
		} catch (error) {
			console.error(error)
		}

		this.$parent.serverTimeInterval = setInterval(() => {
			this.$store.commit(
				'setServerTime',
				moment(this.$store.state.serverTime)
					.add(1, 'seconds')
					.format('YYYY-MM-DD HH:mm:ss')
			)
		}, 1000)
	}
}
</script>

<style scoped>
section {
	border-top: 1px solid #ccc;
	color: #a0a0a0;
	text-align: center;
	padding: 15px;
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

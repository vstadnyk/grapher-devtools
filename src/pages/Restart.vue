<template>
	<section>
		<div>
			{{ timer }}
		</div>
		<button @click="start" class="btn">Start</button>
	</section>
</template>

<script>
// import { RestartServer as mutation } from '../graphql/Info.gql'
import moment from 'moment'

export default {
	data: () => ({
		current: 0
	}),
	computed: {
		timer() {
			return moment()
				.startOf('day')
				.add(this.current, 'seconds')
				.format('HH:mm:ss')
		}
	},
	methods: {
		async start() {
			clearInterval(this.interval)

			this.interval = setInterval(() => {
				this.current += 1
			}, 1000)
		}
	}
}
</script>

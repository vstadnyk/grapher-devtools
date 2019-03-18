<template>
	<div>
		<p
			v-for="({ type, time, row }, i) in logs"
			:key="i"
			:class="type"
			v-text="`${time} - ${row}`"
		/>
	</div>
</template>

<script>
import moment from 'moment'

export default {
	data: () => ({ logs: [], errors: 0 }),
	methods: {
		reset() {
			this.logs = []
			this.errors = 0
		},
		push(type, row) {
			this.logs.push({
				row,
				type,
				time: moment().format('HH:mm:ss.SSS'),
				timeStamp: new Date().getTime()
			})
		},
		log(row) {
			this.push('info', row)
		},
		error(row) {
			this.push('error', row)

			this.errors += 1

			this.$emit('input', this.errors)
		},
		success(row) {
			this.push('success', row)
		},
		async permissionCheck(rule) {
			this.log(`check permission "${rule}"...`)

			try {
				await this.$user.can(rule)

				this.success(`permission "${rule}" granted`)
			} catch (error) {
				this.error(error.message)

				throw error
			}
		}
	}
}
</script>

<style scoped>
div {
	border: 1px solid #ccc;
	height: 270px;
	padding: 5px;
	overflow: auto;
	font-size: 12px;
}
p {
	margin: 0;
	white-space: nowrap;
}
p > * {
	display: inline-block;
	padding: 3px 0;
}
.success {
	color: green;
}
</style>

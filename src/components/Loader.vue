<template>
	<div class="loader">
		<progress v-if="value && value < max" :value="value" :max="max"></progress>
	</div>
</template>

<script>
export default {
	data: () => ({
		value: 0,
		max: 100
	}),
	created() {
		this.$on('start', (value = 5) => {
			clearInterval(this.timer)

			this.value = value
		})

		this.$on('done', () => {
			clearInterval(this.timer)

			this.timer = setInterval(() => {
				if (this.value !== this.max) {
					this.value += 1
				} else {
					clearInterval(this.timer)
					this.value = 0
				}
			}, 1)
		})
	}
}
</script>

<style scoped>
progress {
	display: block;
	width: 100%;
	height: 5px;
	appearance: none;
}
progress::-webkit-progress-bar {
	background: rgba(0, 128, 128, 0.3);
}
progress::-webkit-progress-value {
	background-color: teal;
}
</style>

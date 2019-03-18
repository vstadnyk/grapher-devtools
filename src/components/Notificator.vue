<template>
	<section>
		<progress
			:class="!timer || timer >= timerMax ? 'hide' : null"
			:value="timer"
			:max="timerMax"
		/>
		<div v-if="result" :class="'wrapper'.concat(' ', isError ? 'error' : 'success')">
			<div>
				<div>
					<div v-if="result.type">{{ result.type }}:</div>
					{{ result.message }}
					<template v-if="result.errors">
						<code v-for="({ type, message }, i) in result.errors" :key="i">
							<div>{{ type }}</div>
							<div>{{ message }}</div>
						</code>
					</template>
				</div>
				<button title="Close" @click="reset">✕</button>
			</div>
			<code v-if="result.dump">{{ result.dump }}</code>
		</div>
	</section>
</template>

<script>
export default {
	data: () => ({
		dump: null,
		result: null,
		error: null,
		timer: 0,
		timerMax: 200,
		interval: null,
		resetInterval: null
	}),
	computed: {
		isError() {
			return this.error || this.result instanceof Error
		}
	},
	created() {
		this.$root.$app.$on('before', () => {
			this.startLoader()
		})

		this.$root.$app.$on('success', data => {
			this.response(data)
			this.error = false
		})

		this.$root.$app.$on('error', (error, data) => {
			this.response(data, error)
			this.error = true
		})
	},
	methods: {
		response(
			{
				message = null,
				redirect = 0,
				reset = 0,
				onRedirect = () => true,
				onReset = () => true
			} = {},
			error = null
		) {
			this.stopLoader()

			if (error) this.result = error
			if (message) this.result = { message }

			if (redirect)
				setTimeout(() => {
					const to = onRedirect()
					if (to && typeof to === 'object') this.$router.push(to)
				}, redirect)

			if (reset)
				this.resetInterval = setTimeout(() => {
					if (onReset()) this.reset()
				}, reset)
		},
		startLoader() {
			this.stopLoader()

			this.interval = setInterval(() => {
				if (this.timer >= this.timerMax) this.timer = 0

				this.timer += 1
			}, 1)
		},
		stopLoader() {
			this.timer = this.timerMax

			clearInterval(this.interval)
		},
		reset() {
			this.error = null
			this.result = null
			this.timer = 0

			clearInterval(this.interval)
		}
	}
}
</script>

<style scoped>
.wrapper {
	color: whitesmoke;
	padding: 10px 15px;
}
.wrapper > div {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.error {
	background-color: indianred;
}
.success {
	color: white;
	background: cadetblue;
}
button {
	padding: 7px;
	color: whitesmoke;
}
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
progress.hide {
	opacity: 0;
}
code {
	margin-top: 5px;
	background: whitesmoke;
	color: #444;
	padding: 10px;
	display: block;
}
</style>

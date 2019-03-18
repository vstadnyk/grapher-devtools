<template>
	<section>
		<div :class="'console'.concat(open ? ' open' : '')">
			<ul>
				<li
					v-for="{ id, operation, name, start, finish, error } in logs"
					:key="id"
					@click="open ? (selected = id) : null"
					:class="{
						active: id === selected,
						error: !!error
					}"
				>
					<span>{{ operation }}: {{ name }}</span> <span>{{ finish - start }} ms</span>
				</li>
			</ul>
			<div v-show="details" class="details">
				<viewer v-if="details" :data="details" :options="{ backLink: false }" />
			</div>
			<div class="buttons">
				<template v-if="open">
					<button
						class="btn"
						title="Close"
						v-text="'✕'"
						@click="
							open = false
							selected = null
						"
					/>
					<button
						v-if="open"
						class="btn red"
						title="Clear"
						@click="open ? $store.dispatch('clearRequestsLog') : null"
						v-text="'⊘'"
					/>
				</template>
				<button
					v-else
					class="open"
					title="Open"
					v-text="'⋮'"
					@click="
						open = true
						selected = null
					"
				/>
			</div>
		</div>
	</section>
</template>

<script>
import moment from 'moment'
import Viewer from '../components/Viewer.vue'

export default {
	components: { Viewer },
	data: () => ({
		open: false,
		selected: null
	}),
	computed: {
		logs() {
			const logs = (this.$store.state.requests || []).filter(({ finish }) => finish)

			if (!this.open) return logs.filter((log, i) => i === logs.length - 1)

			return logs
		},
		details() {
			const { id, operation, name, start, finish, variables = [], error, result } =
				this.logs.find(row => row.id === this.selected) || {}

			if (!id) return null

			return {
				operation,
				name,
				load: (finish - start).toString().concat(' ms'),
				start: this.date(start),
				finish: this.date(finish),
				variables,
				result,
				error
			}
		}
	},
	methods: {
		date(stamp) {
			return moment(stamp).format('YYYY-MM-DD HH:mm:ss.SSS')
		},
		clear() {
			this.$store.dispatch('clearRequestsLog')
		}
	}
}
</script>

<style scoped>
section {
	font-size: 12px;
	border-top: 1px solid #ccc;
	position: relative;
	display: flex;
	align-items: center;
}
.console {
	width: 100%;
	overflow: hidden;
	display: grid;
	grid-template-columns: [col] auto [col] min-content [col] min-content;
}
.console:not(.open) {
	color: gray;
}
.console.open {
	position: absolute;
	background: var(--bg-white);
	border: 1px solid #ccc;
	left: 10px;
	bottom: 100%;
	z-index: 10;
	height: 350px;
	overflow: auto;
}
ul {
	display: block;
	margin: 0;
	padding: 5px 0;
	overflow-x: hidden;
}
li {
	cursor: default;
	display: flex;
	justify-content: space-between;
}
.open li {
	cursor: pointer;
}
li > * {
	padding: 5px 10px;
}
.open li:not(.active):hover {
	background: #ccc;
}
.active {
	background: var(--hl);
	color: var(--hl-color);
}
.details {
	padding: 5px;
	border-left: 1px solid #ccc;
	max-width: 300px;
}
button {
	display: flex;
	justify-content: center;
	font-size: 20px;
	padding: 0;
	width: 32px;
	height: 32px;
}
</style>

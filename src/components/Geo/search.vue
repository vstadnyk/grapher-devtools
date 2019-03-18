<template>
	<section>
		<div class="entry">
			<div>
				<input
					type="search"
					v-model="model"
					:class="error ? error : null"
					placeholder="Search..."
					tabindex="1"
					@focus="show(true)"
					@blur="blur"
					@keydown.esc.prevent="show(false)"
					@keydown.arrow-down="moveFocusToLi"
					@keydown.tab.prevent="moveFocusToLi"
				/>
				<div v-if="count" class="counter">{{ count }}</div>
				<div v-if="loading" class="counter">Loading...</div>
			</div>
			<ul v-show="showList" tabindex="-1" @focusout="blur" @keydown.esc.prevent="show(false)">
				<li
					v-for="({ title, text, lat, lng }, i) in list"
					:title="title"
					:key="i"
					tabindex="1"
					@keydown.arrow-down="moveFocusToNext"
					@keydown.arrow-up="moveFocusToPrev"
					@keydown.enter="select(i)"
					@click="select(i)"
				>
					<span v-text="text" /><span v-text="[lat, lng].join(', ')" />
				</li>
			</ul>
		</div>
		<div v-if="error" class="result error">{{ error }}</div>
		<div v-if="selected" class="result">{{ selected }}</div>
	</section>
</template>

<script>
import { search } from '../../controllers/geo'

export default {
	data: () => ({
		value: null,
		loading: null,
		error: null,
		showList: false,
		list: [],
		selected: null
	}),
	computed: {
		model: {
			get() {
				return this.value
			},
			set(value) {
				this.value = value
			}
		},
		count() {
			return this.list.length
		}
	},
	watch: {
		model(value) {
			if (value.length > 3) {
				this.search()
			} else {
				this.loading = null
				this.error = null
			}
		}
	},
	methods: {
		blur({ relatedTarget }) {
			if (!relatedTarget) this.show(false)
		},
		show(show) {
			this.showList = show
		},
		moveFocusToLi({
			target: {
				parentNode: {
					nextElementSibling,
					nextElementSibling: { firstChild }
				}
			}
		}) {
			if (!firstChild) return

			firstChild.focus()

			setTimeout(() => {
				nextElementSibling.scrollTop = 0 // eslint-disable-line no-param-reassign
			}, 10)

			this.show(true)
		},
		moveFocusToNext({
			target: {
				nextElementSibling,
				parentNode: { firstChild }
			}
		}) {
			;(nextElementSibling || firstChild).focus()
		},
		moveFocusToPrev({
			target: {
				previousSibling,
				parentNode: { lastChild }
			}
		}) {
			;(previousSibling || lastChild).focus()
		},
		select(i) {
			const { lat, lng, text } = this.list[i]

			this.model = text

			this.show(false)

			this.$emit('input', [lat, lng])
		},
		async search() {
			this.selected = null

			const find = this.list.find(({ text }) => text === this.model)

			if (!find) {
				this.loading = true

				try {
					this.list = []

					const list = await search(this.model, this.$store.getters.lang, {
						limit: 100
					})

					setTimeout(() => {
						this.list = list.map(
							({ displayName: title, formated: text, lat, lng }) => ({
								text,
								title,
								lat,
								lng
							})
						)

						this.loading = false
					}, 500)
				} catch ({ type = 'Error', message }) {
					this.loading = false
					this.error = type.concat(': ', message)
					this.selected = null
				}
			} else {
				this.list = []

				const { lat, lng, title } = find

				this.selected = [lat, lng, title].join(', ')
			}
		}
	}
}
</script>

<style scoped>
input {
	width: 100%;
	padding: 7px;
	border: 1px solid #ccc;
	background: transparent;
	font-size: inherit;
	font-family: inherit;
	color: inherit;
}
input:hover + .counter,
input:focus + .counter {
	right: 30px;
}
.entry {
	position: relative;
	background: white;
	z-index: 1;
}
.counter {
	position: absolute;
	top: 9px;
	right: 9px;
	z-index: -1;
	font-size: 80%;
	color: gray;
}
ul {
	margin: 0;
	padding: 0;
	position: absolute;
	left: 0;
	top: 100%;
	width: 100%;
	max-height: 330px;
	overflow-x: hidden;
	background: white;
}
li {
	display: flex;
	padding: 7px;
	border: 1px solid #ccc;
	margin-top: -1px;
	cursor: pointer;
	justify-content: space-between;
	align-items: center;
}
li span:first-child {
	width: calc(100% - 200px);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
li span:last-child {
	color: gray;
	font-size: 13px;
	width: 200px;
	text-align: right;
}
li:hover,
li:focus {
	outline: none;
	background-color: var(--hl);
	color: var(--hl-color);
}
li:hover span,
li:focus span {
	color: var(--hl-color);
}
.result {
	font-size: 80%;
	color: gray;
	padding-top: 3px;
}
.result.error {
	color: red;
}
</style>

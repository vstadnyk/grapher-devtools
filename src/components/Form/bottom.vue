<template>
	<div>
		<button
			v-if="!hide.find(row => row === 'active')"
			type="button"
			:class="'btn '.concat(active ? 'red' : 'hightlight')"
			v-text="active ? 'Disable' : 'Enable'"
			@click="active = !active"
		/>
		<div v-else />
		<buttons />
	</div>
</template>

<script>
import buttons from './buttons.vue'

export default {
	components: { buttons },
	data: () => ({ val: null }),
	props: {
		value: {
			type: [Boolean, null],
			default: true
		},
		hide: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		active: {
			get() {
				return this.val !== null ? this.val : this.value
			},
			set(value) {
				this.val = value

				if (!this.hide.find(row => row === 'active')) this.$emit('input', value)
			}
		}
	}
}
</script>

<style scoped>
div {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>

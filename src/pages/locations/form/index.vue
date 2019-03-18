<template>
	<form @submit.prevent="$emit('submit')">
		<top :id="id" />
		<tabs
			:tabs="{
				general: 'General',
				map: 'Map'
			}"
			v-model="tab"
		/>
		<general v-show="tab === 'general'" />
		<div class="map" v-show="tab === 'map'">
			<Map :editable="true" v-model="map" :lat-lng="data.id ? [data.lat, data.lng] : null" />
		</div>
		<bottom v-model="data.active" />
	</form>
</template>

<script>
import controller from '../../../components/Form/controller'
import Map from '../../../components/Geo/map.vue'
import General from './general.vue'

import {
	Location_i18n as query,
	AddLocation as add,
	EditLocation as edit
} from '../../../graphql/Location.gql'

export default {
	mixins: [controller],
	components: { General, Map },
	data: () => ({
		query,
		fields: {
			name: {
				type: String
			},
			lat: {
				type: Number,
				required: true
			},
			lng: {
				type: Number,
				required: true
			},
			building: {
				type: String
			},
			description: {
				type: String
			},
			active: {
				type: Boolean
			}
		},
		mapData: null
	}),
	computed: {
		map: {
			get() {
				return this.mapData
			},
			set(data) {
				this.mapData = data
			}
		},
		where() {
			return this.id ? { input: { id: this.id } } : null
		}
	},
	watch: {
		tab(tab) {
			if (tab === 'map') {
				window.dispatchEvent(new Event('resize'))
			}
		}
	},
	methods: {
		submit(data) {
			this.$save(this.id ? edit : add, data, 'Locatioon saved')
		}
	}
}
</script>

<style scoped>
.map {
	padding: 10px 0;
}
</style>

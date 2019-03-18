<template>
	<section>
		<l-map
			:zoom="zoomTo"
			:center="center"
			:options="options"
			:style="{ height, width }"
			@click="click"
			@update:center="centerUpdate"
		>
			<l-tile-layer :url="url" :attribution="attribution" />
			<l-control v-if="editable" position="topright">
				<div class="control search"><Search v-model="marker" /></div>
			</l-control>
			<l-control v-if="editable" position="topleft">
				<div class="control"><Current v-model="marker" /></div>
			</l-control>
			<l-marker v-if="marker" :lat-lng="marker" @click="getAddress">
				<l-popup v-if="address"><div class="popup" v-text="address"/></l-popup>
			</l-marker>
		</l-map>
	</section>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LControl } from 'vue2-leaflet'
import { search } from '../../controllers/geo'
import Search from './search.vue'
import Current from './current.vue'

export default {
	components: { LMap, LTileLayer, LMarker, LPopup, LControl, Search, Current },
	data: () => ({
		markerPosition: null,
		address: 'Loading...',
		result: null,
		setZoom: null,
		setCenter: null,
		url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}),
	props: {
		latLng: {
			type: Array,
			default: null
		},
		zoom: {
			type: Number,
			default: 13
		},
		editable: {
			type: Boolean,
			default: false
		},
		height: {
			type: String,
			default: '350px'
		},
		width: {
			type: String,
			default: '100%'
		},
		options: {
			type: Object,
			default: () => ({ zoomSnap: 0.5 })
		}
	},
	watch: {
		async markerPosition([lat, lng]) {
			this.setCenter = [lat, lng]

			this.$emit('input', Object.assign({}, this.result || {}, { lat, lng }))
		}
	},
	computed: {
		zoomTo() {
			if (this.setZoom) return this.setZoom

			if (this.latLng) return this.zoom

			return 1
		},
		center() {
			if (this.setCenter) return this.setCenter

			return this.latLng || [0, 0]
		},
		marker: {
			get() {
				return this.markerPosition || this.latLng
			},
			set([lat, lng]) {
				this.markerPosition = [lat, lng]
			}
		}
	},
	methods: {
		click({ latlng: { lat, lng }, originalEvent: { target } }) {
			if (this.editable && /vue2leaflet-map/.test(target.className))
				setTimeout(() => {
					this.marker = [lat, lng]
				}, 100)
		},
		centerUpdate() {
			if (this.marker) this.setZoom = this.zoom
		},
		async getAddress() {
			try {
				const result = ((await search(this.marker)) || []).shift() || {}

				const { formated = null } = result

				this.address = formated
				this.result = result
			} catch (error) {
				this.address = (error.type || 'Error').concat(': ', error.message)
				this.result = null
			}
		}
	}
}
</script>

<style scoped>
.control {
	background: white;
	font-size: 14px;
	border-radius: 5px;
	border: 2px solid rgba(0, 0, 0, 0.2);
}
.search {
	width: 600px;
	padding: 3px;
}
.popup {
	max-width: 250px;
}
</style>

<style src="leaflet/dist/leaflet.css" />

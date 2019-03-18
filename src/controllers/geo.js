// https://korigan.github.io/Vue2Leaflet/#/

import { Icon } from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'

delete Icon.Default.prototype._getIconUrl  // eslint-disable-line

Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

// https://wiki.openstreetmap.org/wiki/Nominatim
export const search = async (q, lang = null, params = {}) => {
	Object.assign(params, { q, format: 'json', addressdetails: 1, dedupe: 1, namedetails: 1 })

	if (lang) Object.assign(params, { 'accept-language': lang })

	const url = 'https://nominatim.openstreetmap.org/search.php'.concat(
		'?',
		Object.entries(params)
			.map(([key, value]) => [key, encodeURIComponent(value)].join('='))
			.join('&')
	)

	const error = original => Object.assign(original, { type: 'GEOCODER_ERROR' })

	try {
		const request = await fetch(url)
		const results = await request.json()

		return results.map(original => {
			const { display_name: displayName, lat, lon, address = null } = original

			const {
				country = null,
				state = null,
				city = null,
				county = null,
				suburb = null,
				town = null,
				village = null,
				neighbourhood = null,
				road = null,
				house_number: building = null
			} = address || {}

			return {
				displayName,
				formated: [
					country,
					city || town || village ? ', '.concat(city || town || village) : null,
					road ? ', '.concat(road) : null,
					building ? ', '.concat(building) : null
				]
					.filter(row => row)
					.join(''),
				address,
				country,
				area: [state, county, neighbourhood, suburb].filter(row => row),
				city: city || town || village,
				street: road,
				building,
				lat: parseFloat(lat),
				lng: parseFloat(lon),
				original
			}
		})
	} catch (err) {
		throw error(err)
	}
}

export default { search }

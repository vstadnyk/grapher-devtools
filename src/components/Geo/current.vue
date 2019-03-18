<template>
	<button @click.prevent="click" type="button" title="Set current position"></button>
</template>

<script>
export default {
	methods: {
		async click({ target }) {
			target.classList.add('load')

			const [lat, lng] =
				(await new Promise(resolve => {
					navigator.geolocation.getCurrentPosition(
						({ coords: { latitude, longitude } }) => {
							resolve([latitude, longitude])
						}
					)
				})) || {}

			this.$emit('input', [lat, lng])

			target.classList.remove('load')
		}
	}
}
</script>

<style scoped>
button {
	width: 30px;
	height: 30px;
	background: white;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
}
button:hover {
	background-color: #f4f4f4;
}
button:after {
	content: '';
	width: 18px;
	height: 18px;
	background-repeat: no-repeat;
	background-position: -90px 0;
	background-size: 180px 18px;
	background-image: url(//maps.gstatic.com/tactile/mylocation/mylocation-sprite-cookieless-v2-2x.png);
}
button:hover:after {
	background-position: -162px 0;
}
.load {
	background-repeat: no-repeat;
	background-position: center;
	background-size: 18px;
	background-image: url('/loader.svg');
}
.load:after {
	display: none;
}
</style>

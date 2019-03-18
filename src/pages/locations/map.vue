<template>
	<article><Map height="480px" :editable="true" :zoom="5" /></article>
</template>

<script>
import Map from '../../components/Geo/map.vue'

export default {
	components: { Map }
}
</script>

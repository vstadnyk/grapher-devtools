<template>
	<ul v-if="routes" :class="cssClass">
		<li v-for="a in routes" :key="a.path">
			<router-link
				:to="a.path"
				v-text="a.name"
				:tag="tag"
			/>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'Menu',
	props: {
		routes: Array,
		cssClass: String,
		tag: {
			type: String,
			default: 'a'
		}
	}
}
</script>

<style scoped>
a {
	font-weight: bold;
	color: #2c3e50;
}
a.active {
	color: #42b983;
}
ul,
li {
	margin: 0;
	padding: 0;
}
</style>

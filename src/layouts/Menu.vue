<template>
	<ul v-if="routes">
		<li v-for="({ path, menu, children }, i) in routes.filter(({ menu }) => menu)" :key="i">
			<router-link :to="path" v-text="menu" />
			<Menu :routes="children" />
		</li>
	</ul>
</template>

<script>
export default { name: 'Menu', props: { routes: Array } }
</script>

<style scoped>
a {
	display: block;
	padding: 12px;
	text-decoration: none;
	color: inherit;
	border-left: 4px solid transparent;
}
a:hover,
a.active {
	background: #3d4045;
	text-decoration: none;
}
a.active {
	border-color: teal;
}
ul,
li {
	margin: 0;
	padding: 0;
}
li ul {
	display: none;
	padding-left: 25px;
}
li > a.active + ul {
	display: block;
}
</style>

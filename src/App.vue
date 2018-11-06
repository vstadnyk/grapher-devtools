<template>
	<main>
		<nav>
			<mainmenu :routes="this.$router.options.routes" />
		</nav>
		<router-view />
	</main>
</template>

<script>
export default {
	name: 'App',
	components: {
		mainmenu: () => import('./components/Menu.vue')
	}
}
</script>

<style>
body {
	margin: 0;
	height: 100vh;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #444;
}
main {
	height: 100vh;
}
</style>

<style scoped>
nav {
	padding: 10px;
}
</style>

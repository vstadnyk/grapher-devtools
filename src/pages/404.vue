<template>
	<center>
		<h1>Page not found</h1>
		<code v-if="$route.redirectedFrom">URL: {{ $route.redirectedFrom }}</code>
	</center>
</template>

<style scoped>
h1 {
	margin: 0;
	color: #666;
	font-size: 32px;
	margin-bottom: 20px;
}
</style>

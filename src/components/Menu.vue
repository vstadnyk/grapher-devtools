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
	display: block;
	padding: 12px;
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
</style>

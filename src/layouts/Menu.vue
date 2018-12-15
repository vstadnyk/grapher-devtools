<template>
	<ul v-if="routes" :class="cssClass">
		<li v-for="a in routes.filter(({ name, menu }) => menu || name)" :key="a.path">
			<router-link
				:to="a.path"
				v-text="a.menu || a.name"
				:tag="tag"
				:exact="a.path === '/'"
			/>
			<ul v-if="a.children">
				<li v-for="child in a.children.filter(({ name, menu }) => menu || name)" :key="child.path">
					<router-link
						:to="child.path"
						v-text="child.menu || child.name"
						:tag="tag"
					/>
					<ul v-if="child.children">
						<li v-for="child in child.children.filter(({ name, menu }) => menu || name)" :key="child.path">
							<router-link
								:to="child.path"
								v-text="child.menu || child.name"
								:tag="tag"
							/>
						</li>
					</ul>
				</li>
			</ul>
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
li ul {
	display: none;
	padding-left: 25px;
}
li > a.active + ul {
	display: block;
}
</style>

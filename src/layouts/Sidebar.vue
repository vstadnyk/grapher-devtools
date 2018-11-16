<template>
	<nav>
		<SideBarTitle/>
		<mainmenu :routes="this.$router.options.routes"/>
	</nav>
</template>

<script>
import mainmenu from '../components/Menu.vue'
import SideBarTitle from '../components/SideBarTitle.vue'

export default {
	name: 'Sidebar',
	components: {
		SideBarTitle,
		mainmenu
	}
}
</script>

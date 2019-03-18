<template>
	<nav><side-bar-title /> <mainmenu :routes="$router.options.routes" /></nav>
</template>

<script>
import mainmenu from './Menu.vue'
import SideBarTitle from './SideBarTitle.vue'

export default { components: { SideBarTitle, mainmenu } }
</script>

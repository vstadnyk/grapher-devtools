<template>
	<div>
		<login ref="login" />
		<main v-if="$store.state.user">
			<aside><sidebar /></aside>
			<section>
				<topbar /><profile />
				<header><notificator /></header>
				<div>
					<router-view v-if="granted" />
					<forbiden v-else />
				</div>
				<tray /><watch />
			</section>
		</main>
	</div>
</template>

<script>
import Tray from './layouts/Tray.vue'
import Login from './layouts/Login.vue'
import Watch from './layouts/Watch.vue'
import Topbar from './layouts/Topbar.vue'
import Sidebar from './layouts/Sidebar.vue'
import Profile from './layouts/Profile.vue'
import Notificator from './components/Notificator.vue'

import Forbiden from './pages/403.vue'
import db from './controllers/db'
import api from './controllers/api'

export default {
	mixins: [db, api],
	components: {
		Tray,
		Login,
		Watch,
		Topbar,
		Sidebar,
		Profile,
		Forbiden,
		Notificator
	},
	data: () => ({ granted: true }),
	computed: {
		auth() {
			return this.$store.state.user
		}
	},
	beforeCreate() {
		this.$user.use(this)
	},
	watch: {
		async $route(route) {
			await this.permission(route)
		},
		async auth(data) {
			this.granted = false

			if (data) await this.permission(this.$route)
		}
	},
	methods: {
		async permission({ meta: { permission } }) {
			await this.$refs.login.sync()

			this.granted = this.$store.getters.userCan(permission)
		}
	}
}
</script>

<style scoped>
main {
	height: 100vh;
	display: grid;
	grid-template-rows: min-content auto;
	grid-template-columns: min-content auto;
	grid-template-areas: 'aside section';
}
main > aside {
	grid-area: aside;
	background: #43474d;
	width: 200px;
}
main > section {
	grid-area: section;
	background: #f9f9f9;
	color: #222;
	display: grid;
	height: 100vh;
	grid-template-columns: [col] auto [col] 150px;
	grid-template-rows: [row] min-content [row] min-content [row] auto [row] min-content;
}
main > section > *:not(section) {
	grid-column: col / span 2;
}
main > section > div {
	grid-row: row 3;
	background: #eee;
	padding: 10px;
	overflow: auto;
}
main > section > div > *:not(header) {
	background-color: #f9f9f9;
	padding: 10px;
	height: calc(100% - 20px);
	overflow: hidden;
}
main > section > div > *:not(section) {
	overflow: auto;
}
header {
	border-bottom: 1px solid #ccc;
}
</style>

<style>
:root {
	--color: rgba(255, 255, 255, 0.8);
	--bg-white: #f9f9f9;
	--red: indianred;
	--hl-color: whitesmoke;
	--hl: teal;
}
body {
	margin: 0;
	font-family: Helvetica, Arial, sans-serif;
	color: var(--color);
	background: rgb(50, 54, 57);
}
button {
	border: none;
	border-radius: 0;
	font-size: inherit;
	font-family: inherit;
	cursor: pointer;
	padding: 0;
	background: transparent;
}
.btn {
	cursor: pointer;
	background-color: #ccc;
	padding: 7px 20px;
	text-decoration: none;
}
.btn span {
	margin-left: -5px;
}
.btn:hover {
	background-color: #eee;
}
.btn.hightlight {
	background-color: var(--hl);
	color: var(--hl-color);
}
.btn.hightlight:not([disabled]):hover {
	background: rgba(0, 128, 128, 0.7);
}
a.btn:hover {
	text-decoration: none;
}
.btn.red,
.btn.remove {
	background-color: var(--red);
	color: var(--hl-color);
}
.btn.red:hover,
.btn.remove:hover {
	background-color: rgba(205, 92, 90, 0.7);
}
.btn.green {
	background-color: lightgreen;
}
.btn[disabled] {
	cursor: default;
}
.error {
	color: var(--red);
}
h2 {
	margin: 0;
	margin-bottom: 15px;
	color: #a0a0a0;
	font-weight: normal;
}
</style>

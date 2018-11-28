<template>
	<div>
		<Login ref="Login" />
		<main v-if="isLogin">
			<aside>
				<Sidebar />
			</aside>
			<section>
				<Topbar />
				<Logout ref="Logout" />
				<Loader ref="Loader" />
				<div>
					<router-view />
				</div>
				<Tray ref="Tray" />
				<Watch />
			</section>
		</main>
	</div>
</template>

<script>
import Sidebar from './layouts/Sidebar.vue'
import Topbar from './components/Topbar.vue'
import Logout from './components/Logout.vue'
import Tray from './components/Tray.vue'
import Watch from './components/Watch.vue'
import Login from './layouts/Login.vue'
import Loader from './components/ui/Loader.vue'

import { PingToken } from './graphql/User.gql'

import { ping as config } from '../config'

export default {
	name: 'App',
	components: {
		Sidebar,
		Topbar,
		Logout,
		Login,
		Watch,
		Tray,
		Loader
	},
	computed: {
		isLogin() {
			return this.$store.state.isLogin
		},
		isOnline() {
			return this.$store.state.isOnline
		}
	},
	async beforeCreate() {
		if (this.$store.getters.accessToken) this.$store.commit('isLogin', true)

		try {
			const { ping } = await this.$api.query(PingToken)

			this.$store.commit('isLogin', ping)

			if (config.intervals.token)
				this.pingTokenInterval = setInterval(() => {
					if (this.$refs.Tray) this.$refs.Tray.ping()
				}, config.intervals.token)
		} catch (error) {
			throw error
		}
	},
	created() {
		this.$on('loader', (event = 'start') => {
			if (this.$refs.Loader) this.$refs.Loader.$emit(event)
		})
	}
}
</script>

<style>
body {
	margin: 0;
	font-family: Helvetica, Arial, sans-serif;
	color: rgba(255, 255, 255, 0.8);
	background: rgb(50, 54, 57);
}
a {
	text-decoration: none;
	color: inherit;
	display: inline-block;
}
a:hover {
	text-decoration: underline;
}
input,
select,
option {
	font-family: inherit;
	font-size: inherit;
	border: 1px solid #ccc;
	padding: 7px;
}
input {
	max-width: calc(100% - 14px);
}
select {
	appearance: none;
	border-radius: 0;
	padding-right: 22px;
	background-position: calc(100% - 3px) 50%;
	background-repeat: no-repeat;
	background-size: 16px;
	background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7.406 7.828l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z'%3E%3C/path%3E%3C/svg%3E");
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
	background: #ccc;
	padding: 7px 20px;
}
.btn span {
	margin-left: -5px;
}
.btn.hightlight,
.btn:not(.hightlight):hover {
	background-color: teal;
	color: white;
}
.btn.hightlight:not(.btn[disabled]):hover {
	color: #222;
	background: #ccc;
}
.btn.red {
	background-color: lightcoral;
}
.btn.green {
	background-color: lightgreen;
}
.btn[disabled] {
	cursor: default;
}
.error {
	color: red;
}
</style>

<style scoped>
main {
	height: 100vh;
	display: grid;
	grid-template-rows: auto;
	grid-template-columns: 20% 80%;
	grid-template-areas: 'aside section';
}
main > aside {
	grid-area: aside;
	background: #43474d;
}
main > section {
	grid-area: section;
	background: #f9f9f9;
	color: #222;
	display: grid;
	grid-template-columns: [col] auto [col] 150px;
	grid-template-rows: [row] 50px [row] 5px [row] auto [row] 50px;
}
main > section > div:not(.loader) {
	grid-row: row 3;
	grid-column: col / span 2;
	background: #eee;
	padding: 15px;
	padding-top: 10px;
	overflow: hidden;
}
main > section > div:not(.loader) > * {
	background-color: #f9f9f9;
	padding: 10px;
	height: calc(100% - 20px);
	overflow-x: hidden;
}
.loader {
	grid-row: row 2;
	grid-column: col / span 2;
	background: #eee;
}
</style>

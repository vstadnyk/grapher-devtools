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
import Topbar from './layouts/Topbar.vue'
import Logout from './layouts/Logout.vue'
import Tray from './layouts/Tray.vue'
import Watch from './layouts/Watch.vue'
import Login from './layouts/Login.vue'
import Loader from './components/Loader.vue'

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
option,
textarea {
	font-family: inherit;
	font-size: inherit;
	border: 1px solid #ccc;
	padding: 7px;
}
input,
textarea {
	max-width: calc(100% - 16px);
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
label sup {
	color: red;
	padding-right: 5px;
}
.btn {
	cursor: pointer;
	background: #ccc;
	padding: 7px 20px;
}
.btn span {
	margin-left: -5px;
}
.btn:hover {
	background-color: #eee;
}
.btn.hightlight {
	background-color: teal;
	color: white;
}
.btn.hightlight:not([disabled]):hover {
	background: rgba(0, 128, 128, 0.7);
}
a.btn:hover {
	text-decoration: none;
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
code {
	display: block;
	max-width: 700px;
	white-space: pre-wrap;
	word-break: break-all;
	font-size: inherit;
}
table {
	font-size: 13px;
	width: 100%;
	max-width: 100%;
	border-collapse: collapse;
}
td,
th {
	border: 1px solid #ccc;
	padding: 5px;
}
th {
	text-align: center;
}
td.code {
	white-space: pre-wrap;
}
div.viewer {
	overflow: auto;
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
	height: 100vh;
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

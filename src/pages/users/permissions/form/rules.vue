<template>
	<div v-if="$parent.data.rules">
		<hr />
		<p><Input type="search" placeholder="Search" v-model="search" /></p>
		<div class="grid">
			<div
				v-for="rule in Object.keys(Object.assign({}, rules, $parent.data.rules))"
				:key="rule"
				v-show="!search || rule.indexOf(search) !== -1"
			>
				<checkbox :label="rule" v-model="$parent.data.rules[rule]" />
			</div>
		</div>
	</div>
</template>

<script>
import { Available as query } from '../../../../graphql/UserPermission.gql'

import Input from '../../../../components/Elements/Input.vue'
import Checkbox from '../../../../components/Elements/Checkbox.vue'

export default {
	components: { Checkbox, Input },
	data: () => ({
		rules: {},
		search: null
	}),
	methods: {
		getRouterPermissions(router, result = []) {
			router.forEach(({ meta: { permission } = {}, children }) => {
				if (permission) {
					if (Array.isArray(permission)) {
						result.push(...permission)
					} else {
						result.push(permission)
					}
				} else if (children) {
					this.getRouterPermissions(children, result)
				}
			})

			return result
		}
	},
	async created() {
		const routerPermissions = this.getRouterPermissions(this.$router.options.routes)

		const { rules: serverRules = [] } = (await this.$parent.$query(query)) || {}

		const all = serverRules.concat(routerPermissions)

		all.sort()

		const rules = Object.assign(
			...[...new Set(all)].map(rule => ({ [rule]: false })).concat([{}])
		)

		this.$parent.data = { rules }

		this.rules = rules
	}
}
</script>

<style scoped>
.grid {
	margin: 8px -2px;
}
.grid > * {
	margin: 2px;
	width: calc(25% - 4px);
	display: inline-block;
}
p {
	display: inline-block;
	margin: 0;
}
</style>

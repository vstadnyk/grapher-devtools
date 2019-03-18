<template>
	<div class="flex">
		<div><InputImage name="photo" v-model="$parent.data.photo" thumbSize="280px" /></div>
		<div>
			<p>
				<Input
					label="Email"
					type="email"
					name="mail"
					v-model="$parent.data.mail"
					:required="!!!$parent.data.id"
					:autocomplete="false"
					:disabled="!!$parent.data.id"
				/>
			</p>
			<p>
				<InputPass
					label="Password"
					name="pass"
					v-model="$parent.data.pass"
					:required="!!!$parent.data.id"
				/>
			</p>
			<p>
				<Select
					label="Permission"
					name="permission"
					:options="$store.getters.userPermissionsListAlias"
					v-model="$parent.data.role"
					:appendEmpty="false"
				/>
			</p>
		</div>

		<div>
			<p><Input label="First name" name="firstName" v-model="$parent.data.firstName" /></p>
			<p><Input label="Last name" name="lastName" v-model="$parent.data.lastName" /></p>
			<p><Input label="Full name" name="fullName" v-model="$parent.data.fullName" /></p>
			<p><Input label="Phone" name="phone" v-model="$parent.data.phone" /></p>
			<p>
				<Input label="Display name" name="displayName" v-model="$parent.data.displayName" />
			</p>
		</div>
	</div>
</template>

<script>
import Input from '../../../components/Elements/Input.vue'
import Select from '../../../components/Elements/Select.vue'
import InputPass from '../../../components/Elements/InputPass.vue'
import InputImage from '../../../components/Elements/InputImage.vue'

export default {
	components: { Input, Select, InputPass, InputImage }
}
</script>

<style scoped>
.flex {
	display: flex;
	justify-content: space-between;
}
.flex > * {
	width: calc((100% / 3) - 20px);
	padding-top: 10px;
}
</style>

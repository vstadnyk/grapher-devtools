<template>
	<div class="flex">
		<router-link
			:to="{
				name: ($parent.data.active ? 'disable' : 'enable').concat('User'),
				params: { id: $parent.data.id }
			}"
			v-text="$parent.data.active ? 'Disable' : 'Enable'"
			:class="'btn'.concat(' ', $parent.data.active ? 'red' : 'hightlight')"
		/>
		<div>
			<router-link
				:to="{
					name: $parent.data.active ? 'disableUser' : 'enableUser',
					query: { user: $parent.data.id }
				}"
				class="btn hightlight"
			>
				Send email
			</router-link>
		</div>
	</div>
</template>

<style scoped>
.flex {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 -5px;
	margin-top: 5px;
}
.btn {
	margin: 5px;
	margin-bottom: 0;
}
</style>

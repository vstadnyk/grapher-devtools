<template>
	<section>
		<p>
			<Input
				label="Key"
				name="key"
				v-model="$parent.data.key"
				required
				:disabled="!!$parent.data.id"
			/>
		</p>
		<p><Input label="Name" name="name" v-model="$parent.data.name" /></p>
		<p><Textarea label="Description" name="description" :value="$parent.data.description" /></p>
	</section>
</template>

<script>
import Input from '../../../../components/Elements/Input.vue'
import Textarea from '../../../../components/Elements/Textarea.vue'

export default { components: { Input, Textarea } }
</script>

<style scoped>
section {
	padding-left: 15px;
}
.row {
	margin-top: 15px;
	display: flex;
	justify-content: space-between;
}
.row > * {
	width: calc(50% - 10px);
}
</style>

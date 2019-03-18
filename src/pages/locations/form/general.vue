<template>
	<section>
		<div class="rows">
			<div class="latlng">
				<div>
					<fieldset>
						<legend>Coords</legend>
						<p>
							<Input
								label="Lat"
								v-model="model.lat"
								name="lat"
								required
								step="any"
								type="number"
							/>
						</p>
						<p>
							<Input
								label="Lng"
								v-model="model.lng"
								name="lng"
								required
								step="any"
								type="number"
							/>
						</p>
					</fieldset>
				</div>
				<div>
					<fieldset>
						<legend>Address</legend>
						<p>
							<Input
								label="Country"
								v-model="model.country"
								disabled
								:lang="$parent.lang"
							/>
						</p>
						<p>
							<Input
								label="City"
								v-model="model.city"
								disabled
								:lang="$parent.lang"
							/>
						</p>
						<p>
							<Input
								label="Street"
								v-model="model.street"
								disabled
								:lang="$parent.lang"
							/>
						</p>
						<p><Input label="Building" v-model="model.building" name="building" /></p>
					</fieldset>
				</div>
			</div>
			<div>
				<p><Input label="Name" v-model="model.name" name="name" /></p>
				<p>
					<Textarea label="Description" v-model="model.description" name="description" />
				</p>
			</div>
		</div>
	</section>
</template>

<script>
import controller from '../../../components/Form/controller'

export default {
	mixins: [controller],
	computed: {
		model() {
			return this.$parent.map || this.$parent.data
		}
	}
}
</script>

<style scoped>
.rows {
	display: grid;
	grid-template-columns: 60% 40%;
	grid-column-gap: 10px;
}
.latlng {
	display: grid;
	grid-template-columns: 40% 60%;
	padding-right: 10px;
	padding-top: 15px;
	grid-column-gap: 10px;
}
p {
	margin: 0;
	margin-top: 10px;
}
.latlng p {
	margin: 0;
	margin-bottom: 10px;
}
fieldset {
	border: 1px solid #ccc;
}
</style>

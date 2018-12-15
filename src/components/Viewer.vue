<template>
	<div>
		<div v-if="objectEntries">
			<p v-for="[key, value] in objectEntries" :key="key">
				<b>{{ key }}:</b>
				{{ value }}
			</p>
		</div>
		<table v-if="objectEntriesTable">
			<tbody>
				<tr v-for="[key, value] in objectEntriesTable" :key="key">
					<th width="1">{{ key }}</th>
					<td><code>{{ value }}</code></td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: 'Viewer',
	props: {
		objectEntries: Array,
		objectEntriesTable: Array
	}
}
</script>

<style scoped>
p {
	margin: 5px 0;
}
b {
	text-transform: capitalize;
}
th {
	vertical-align: top;
	text-align: left;
}
</style>

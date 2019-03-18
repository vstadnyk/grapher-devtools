export default {
	value: null,
	query: {
		type: Object,
		default: null
	},
	data: {
		type: Object,
		default: () => ({})
	},
	input: {
		type: Object,
		default: () => ({
			params: {
				limit: 10,
				offset: 0,
				order: {
					column: 'id',
					sort: 'DESC'
				}
			}
		})
	},
	fields: {
		type: Object,
		default: () => ({ id: { name: 'ID', sortable: true } })
	},
	dataHook: {
		type: Function,
		default: async ({ count = null, rows = null } = {}) => ({ count, rows })
	},
	actions: {
		type: Object,
		default: null
	},
	options: {
		type: Object,
		default: () => ({
			limitStep: 10,
			showCheckboxes: true,
			pagination: true,
			idKey: 'id'
		})
	}
}

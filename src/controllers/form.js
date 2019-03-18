import { objectMergeRecursive } from './lib'

export const parseFieldName = f =>
	!/\[/.test(f) ? f : [f.split('[').shift()].concat(f.match(/(?=\[)(.*?)(?=\])/gi))

export const getDataRaw = (form = {}, blackList = []) => {
	const { elements = [] } = form || {}

	return Array.from(elements)
		.filter(({ name }) => name)
		.reduce((memo, { name, value, type = null }) => {
			const obj = { ...memo }

			let val = value || null

			if (val === 'on') val = true
			if (val === 'off') val = false

			if (blackList.find(row => row === name)) return obj

			if (type === 'number') val = parseFloat(val)

			obj[name] = val

			return obj
		}, {})
}

export const parseData = (data = {}) => {
	const result = {}

	Object.entries(data).forEach(([key, value]) => {
		if (/\[/.test(key)) {
			const ar = parseFieldName(key)

			objectMergeRecursive(
				result,
				ar.reduceRight(
					(o, v, i) => Object.assign({}, { [v]: i === ar.length - 1 ? value : o }),
					{}
				)
			)
		} else {
			Object.assign(result, { [key]: value })
		}
	})

	return result
}

export const getData = (form = {}, blackList = []) => parseData(getDataRaw(form, blackList))

export default { getData }

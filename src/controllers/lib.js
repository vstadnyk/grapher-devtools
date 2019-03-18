export const arrayChunk = (array = [], size = 1) =>
	array.reduce(
		(chunks, el, i) =>
			(i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) && chunks,
		[]
	)

export const objectFilter = (o = {}, callback = (k, v) => k && v) =>
	Object.assign(
		...Object.entries(o)
			.filter(([k, v]) => callback(k, v))
			.map(([k, v]) => ({ [k]: v }))
			.concat([{}])
	)

export const arrayToObject = (array = []) =>
	array.reduce((obj, cur) => Object.assign(obj, { [cur]: cur }), {})

export const objectMergeRecursive = (result = {}, obj = {}) => {
	Object.entries(obj).forEach(([key, value]) => {
		if (!result[key]) {
			Object.assign(result, { [key]: value })
		} else if (typeof value === 'object') {
			objectMergeRecursive(result[key], value)
		}
	})

	return result
}

export const objectRemoveRecursive = (object, path = []) => {
	path.forEach((field, index) => {
		if (Object.keys(object).find(row => row === field)) {
			const current = object[field]

			if (Array.isArray(current) && path.length === 2) {
				current.splice(parseInt(path[index + 1], 0), 1)
			} else if (typeof current === 'object' && path.length > 1) {
				path.shift()

				objectRemoveRecursive(current, path)
			} else {
				delete object[field] // eslint-disable-line no-param-reassign
			}
		}
	})

	return object
}

export const mapToObject = map =>
	map instanceof Map
		? Object.assign(
				{},
				...Array(...map.entries())
					.filter(([i]) => i)
					.map(([i, v]) => ({ [i]: v }))
		  )
		: map

export default {}

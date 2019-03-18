import { server as config } from '../../config'

export const fetchFileToBlob = async url => {
	try {
		const responce = await fetch(url, { mode: 'cors' })
		const blob = await responce.blob()

		return blob
	} catch (error) {
		console.error(error)

		return null
	}
}

export const humanFileSize = (size, si = 1000) => {
	const i = Math.floor(Math.log(size) / Math.log(si))

	return `${(size / si ** i).toFixed(3) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`
}

export const getFileSize = async url => {
	let fileSize = 0

	try {
		const { size = 0 } = (await fetchFileToBlob(url)) || {}

		fileSize = size
	} catch (error) {
		console.error(error)
	}

	return humanFileSize(fileSize)
}

export const url = (() => {
	const { host, ports } = config
	const { protocol, hostname } = window.location

	return protocol.concat(
		'//',
		hostname === host ? host : hostname,
		':',
		ports[protocol.replace(':', '')]
	)
})()

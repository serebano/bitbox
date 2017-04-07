import Path from './path'

function set(target, path, value) {
	const keys = Path.keys(path)

	return keys.reduce((step, key, index) => {
		if (index === keys.length - 1)
			step[key] = value

		else if (!step[key])
		   	throw new Error(`The path "${path}" is invalid, can not set state. Does the path "${keys.splice(0, keys.length - 1).join('.')}" exist?`)

		return step[key]
	}, target)

}

export default set

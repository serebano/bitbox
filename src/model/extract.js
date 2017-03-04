import Path from './path'

function extract(target, path, view, ...args) {
	const keys = Path.keys(path)

	return keys.reduce((step, key, index) => {
		if (index === keys.length - 1)
			return view(step, key, ...args)

		else if (!step[key])
		   	throw new Error(`The path "${path}" is invalid, can not update state. Does the path "${keys.splice(0, keys.length - 1).join('.')}" exist?`)

		return step[key]
	}, target)

}

export default extract

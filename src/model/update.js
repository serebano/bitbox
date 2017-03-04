import Path from './path'

function update(target, path, operator, ...args) {

	if (typeof operator !== "function")
		throw new Error(`Cannot update ${path}, missing operator`)

	path = Path.keys(path)

	const change = {
		path: path,
		args: args,
		operator: operator.displayName || operator.name
	}

	path.reduce((step, key, index) => {
		if (index === path.length - 1) {
			const value = step[key]

			operator(step, key, ...args)

			if (step[key] !== value || (isComplexObject(step[key]) && isComplexObject(value)))
				change.changed = true

		} else if (!step[key]) {
			throw new Error(`The path "${path}" is invalid, can not update state. Does the path "${path.splice(0, path.length - 1).join('.')}" exist?`)
		}

		return step[key]
	}, target)

	return change
}

export default update

import Path from './path'

function get(target, path, transform) {
	const value = Path.keys(path)
		.reduce((state, key, index) => state
			? state[key]
			: undefined,
		target)

	return transform
		? transform(value)
		: value
}

export default get

function concat(path, ...args) {
	return commit(update(path, ...args,
		function concat(target, key, ...values) {
			target[key] = target[key].concat(values)
		}
	), true)
}

export default concat

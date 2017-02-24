function sync(target, remote) {
	return function sync(context) {
		const cached = context.get(target)

		if (cached)
			return Promise.resolve(cached)

		return context.set(target, remote)
	}
}

export default sync

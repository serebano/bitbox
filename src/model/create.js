function Model(target, handler, create) {
	if (typeof create === "function")
		return create(target, handler)

	return Object.keys(handler).reduce((model, key) => {
		model[key] = (...args) => handler[key](target, ...args)
		model[key].displayName = key

		return model
	}, {})
}

export default Model

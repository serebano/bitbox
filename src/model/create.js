function Model(target, handler, create, ...rest) {
	if (typeof create === "function")
		return create(target, handler, ...rest)

	return Object.keys(handler).reduce((model, key) => {
		model[key] = (...args) => handler[key](target, ...args)
		model[key].displayName = key

		return model
	}, {})
}

export default Model

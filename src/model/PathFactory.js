import Path from './path'

export default (root, store) => {
	const accessors = ["get", "has", "keys", "values"]

	function createModel(target, handler) {
		return Object.keys(handler).reduce((model, name) => {
			if (accessors.indexOf(name) > -1)
				model[name] = (path) => Path.resolve(root, path).reduce(handler.get, target)
			else
				model[name] = (path, ...args) => model.apply(path, handler[name], ...args)
			model[name].displayName = name

			return model
		}, {
			apply(path, trap, ...args) {
				let changed;

				Path.resolve(root, path).reduce((target, key, index, keys) => {
					if (index === keys.length - 1) {
						const state = target[key]
						const result = trap(target, key, ...args)

						if (state !== target[key]) {
							store.changes.push(keys, trap.name, { args, result, state }, true)
							changed = { path: keys, method: trap.name, args }
						}
					}

					if (!(key in target))
						target[key] = {}

					return handler.get(target, key)
				}, target)

				return changed
			},
			provider(context, action) {
				context[root] = this

				if (context.debugger) {
					context[root] = createModel(target, {
						get: handler.get,
						has: handler.has,
						set: handler.set,
					})

					const apply = context[root].apply

					context[root].apply = (...args) => {
						const changed = apply(...args)
						if (changed) {
							if (context && context.debug) {
								//console.info(`!!!(changed)`, changed)
								context.debug({
									type: 'mutation',
									method: changed.method,
									args: [ changed.path.slice(1), ...changed.args ]
								})
							}
						}
					}
				}

				return context
			}
		})
	}

	return createModel
}

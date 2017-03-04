import Path from './path'
import {isComplexObject} from '../utils'

export default (root, store) => {
	const accessors = ["get", "has", "keys", "values"]

	function createModel(target, handler) {
		return Object.keys(handler).reduce((model, name) => {
			if (accessors.indexOf(name) > -1)
				model[name] = (path) => Path.resolve(root, path).reduce(handler.get, target)
			else
				model[name] = function(path, ...args) {
					return model.apply(path, handler[name], ...args)
				}

			model[name].displayName = name

			return model
		}, {
			model(handler) {
				return createModel(target, handler || {get:handler.get})
			},
			apply(path, trap, ...args) {
				trap = typeof trap === "string"
					? handler[trap]
					: trap

				let changed;

				Path.resolve(root, path).reduce((target, key, index, keys) => {
					if (index === keys.length - 1) {
						const state = target[key]
						const result = trap(target, key, ...args)

						if (state !== target[key] || (isComplexObject(target[key]) && isComplexObject(state))) {
							store.changes.push(keys, trap.name, { args, result, state }, true)
							changed = { path: keys, method: trap.name, args }
						}
					}

					if (name === "set" && !(key in target))
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

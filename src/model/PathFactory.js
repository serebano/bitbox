import Path from './path'
import {isComplexObject} from '../utils'
import apply from '../model/apply'
import extract from '../model/extract'

export default (root, store) => {
	const accessors = ["get", "has", "keys", "values"]

	function createModel(target, handler) {
		return Object.keys(handler).reduce((model, name) => {
			if (accessors.indexOf(name) > -1)
				model[name] = function $extract(path, ...args) {
					return model.extract(path, handler[name], ...args)
				}
			else
				model[name] = function $apply(path, ...args) {
					return model.apply(path, handler[name], ...args)
				}

			model[name].displayName = name

			return model
		}, {
			extract(path, view, ...args) {
				view = (typeof view === "string") ? handler[view] : view

				return extract(target, Path.resolve(root, path), view, ...args)
			},
			apply(path, trap, ...args) {
				trap = (typeof trap === "string") ? handler[trap] : trap
				const changed = apply(target, Path.resolve(root, path), trap, ...args)

				if (changed)
					store.changes.push(changed)

				return changed
			},
			provider(context, action) {
				context[root] = this

				if (context.debugger) {
					const model = createModel(target, handler)
					const apply = model.apply
					delete model.provider

					context[root] = Object.assign(model, {
						apply(...args) {
							const changed = apply(...args)
							if (changed && context.debug) {
								context.debug({
									type: 'mutation',
									method: changed.method,
									args: [ changed.path.slice(1), ...changed.args ]
								})
							}
						}
					})
				}

				return context
			}
		})
	}

	return createModel
}

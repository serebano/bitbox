import Model from '../model/create'
import Path from '../model/path'
import {getProviders} from '../utils'

export default (target, store) => {

	return new Model(target,
		{
			get(target, key) {
				if (!target || !target.modules)
					return undefined

				return target.modules[key]
			},
			has(target, key) {
				return target.modules && key in target.modules
			},
			add(target, key, module = { modules: {} }) {
				if (!target.modules)
					target.modules = {}

				target.modules[key] = module
			},
			remove(target, key) {
				delete target.modules[key]
			}
		},
		function Modules(target, handler) {
			return {
				get(path) {
					return Path.reduce(path, handler.get, target)
				},
				has(path) {
					return Path.reduce(path, handler.has, target)
				},
				add(path, desc) {
					if (arguments.length === 1 && typeof path === "object") {
						desc = path
						path = []
					}

					const keys = Path.keys(path)
					const length = keys.length
					const module = typeof desc === "function"
						? desc({
							path: keys.join("."),
							name: keys[length-1]
						}) || {}
						: desc || {}

					keys.reduce((target, key, index) => {
						return index === length - 1
							? handler.add(target, key, module)
							: handler.get(target, key)
					}, target)

					// set state
					store.state.set(keys, module.state || {})

					// set signals
					Object.keys(module.signals || {}).forEach(signalKey => {
						store.signals.add(keys.concat(signalKey), module.signals[signalKey])
					})

					// add submodules
					Object.keys(module.modules || {}).forEach(moduleKey => {
						this.add(keys.concat(moduleKey), module.modules[moduleKey])
					})

					//store.changes.push(keys, 'add', { module }, true)
				},
				remove(path) {
					Path.reduce(path, (target, key, index, keys) => {
						if (index === keys.length - 1) {
							const module = handler.get(target, key)

							// remove submodules
							if (module.modules)
								Object.keys(module.modules).forEach(moduleKey => {
									this.remove(keys.concat(moduleKey))
								})

							// unset signals
							if (module.signals)
								Object.keys(module.signals).forEach(signalKey => {
									store.signals.remove(keys.concat(signalKey))
								})

							// unset state
							//if (module.state)
							store.state.unset(keys)

							// remove this module
							handler.remove(target, key)

							//store.changes.push(keys, 'remove', null, true)
						}

						return handler.get(target, key)
					}, target)
				},
				getProviders() {
					return getProviders(target)
				}
			}
		}
	)
}

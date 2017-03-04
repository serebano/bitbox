import Model from '../model/create'
import Path from '../model/path'
import {getProviders} from '../utils'
import apply from '../model/apply'
import extract from '../model/extract'

export default (target, store) => {

	return new Model(target,
		{
			get(target, key) {
				if (!target || !target.modules)
					return undefined

				return target.modules[key]
			},
			ensure(target, key, value) {
				if (!target)
					return undefined

				if (!target.modules)
					target.modules = {}

				if (!target.modules[key])
					target.modules[key] = value || {}

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
					if (arguments.length === 1 && (typeof path === "object" || typeof path === "function")) {
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
							: handler.ensure(target, key, {})
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

					store.changes.push({ path: ['modules'].concat(keys), keys, method: 'add', args: [desc] })

					return module
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
							store.state.unset(keys)

							// remove this module
							handler.remove(target, key)

							store.changes.push({ path, keys, method: 'remove' })
						}

						return handler.get(target, key)
					}, target)
				},
				extract(path, view, ...args) {
					view = (typeof view === "string") ? handler[view] : view

					return extract(target, Path.resolve(root, path), view, ...args)
				},
				apply(path, trap, ...args) {
					trap = (typeof trap === "string") ? handler[trap] : trap
					const changed = apply(target, Path.resolve(root, path), trap, ...args)

					if (changed) {
						//changed.path = [root].concat(changed.path)
						store.changes.push(changed)
					}

					return changed
				},
				getProviders() {
					return getProviders(target)
				}
			}
		}
	)
}

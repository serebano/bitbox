import Model from '../model'
import Path from '../model/path'
import {getProviders} from '../utils'

export default (target, store) => {

	function ensure(target, key, value) {
		if (!target)
			return undefined

		if (!target.modules)
			target.modules = {}

		if (!target.modules[key])
			target.modules[key] = value || {}

		return target.modules[key]
	}

	return Model(target, {
		get(path) {
			return this.extract(path, function get(target, key) {
				if (!target || !target.modules)
					return undefined

				return target.modules[key]
			})
		},
		has(path) {
			return this.extract(path, function has(target, key) {
				return target.modules && (key in target.modules)
			})
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
				if (index === length - 1) {
					if (!target.modules)
						target.modules = {}

					target.modules[key] = module
				} else {
					return ensure(target, key, {})
				}
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

			//store.changes.push({ path: ['modules'].concat(keys), keys, method: 'add', args: [desc] })

			return module
		},
		remove(path) {
			Path.reduce(path, (target, key, index, keys) => {
				if (index === keys.length - 1) {
					const module = target[key]

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
					delete target[key]

					//store.changes.push({ path, keys, method: 'remove' })
				}

				return target[key]
			}, target)
		},
		getProviders() {
			return getProviders(target)
		}
	})

}

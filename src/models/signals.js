import Model from '../model/create'
import Path from '../model/path'

export default (target, store) => {
	const root = "signals"

	return new Model(target,
		{
			get(target, key) {
				return target[key]
			},
			has(target, key) {
				return key in target
			},
			set(target, key, chain) {
				return target[key] = (props) => {
					store.runTree(key, chain, props)
					//(err,res) => console.log(`on-done`, err, res)
				}
			},
			unset(target, key) {
				delete target[key]
			}
		},
		function Signals(target, handler) {
			return {
				get(path, chain) {
					if (chain)
						return this.chain(path)

					return Path.resolve(root, path).reduce(handler.get, target)
				},
				set(path, chain) {
					return this.apply(path, handler.set, chain)
				},
				add(path, chain) {
					return this.apply(path, handler.set, chain)
				},
				unset(path) {
					return this.apply(path, handler.unset)
				},
				remove(path) {
					return this.apply(path, handler.unset)
				},
				run(path, props) {
					return this.get(path)(props)
				},
				chain(path) {
					const keys = Path.keys(path)
					const key = keys.pop()
					const module = store.modules.get(keys)

					return handler.get(module.signals, key)
				},
				apply(path, trap, ...args) {
					let changed;

					Path.resolve(root, path).reduce((target, key, index, keys) => {
						if (index === keys.length - 1) {
							const state = target[key]
							const result = trap(target, key, ...args)

							if (state !== target[key])
								changed = store.changes.push(keys, trap.name, { args, result, state }, true)

							return result
						}

						if (!(key in target))
							target[key] = {}

						return handler.get(target, key)
					}, target)

					return changed
				}
			}
		}
	)
}

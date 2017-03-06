import Path from '../model/path'
import apply from '../model/apply'

function Signals(target, store, root = 'signals') {
	return {
		get(path, chain) {
			return Path.resolve(root, path).reduce(function get(target, key) {
				return target[key]
			}, target)
		},
		add(path, chain) {
			return this.apply(path, function add(target, key, chain) {
				target[key] = (props) => {
					store.runTree(key, chain, props)
				}
			}, chain)
		},
		remove(path) {
			return this.apply(path, function remove(target, key) {
				delete target[key]
			})
		},
		run(path, props) {
			return this.get(path)(props)
		},
		apply(path, trap, ...args) {
			const changed = apply(target, Path.resolve(root, path), trap, ...args)

			if (changed)
				store.changes.push(changed)

			return changed
		}
	}
}

export default Signals

export default {
	reduce(path, func, target) {
		return this.keys(path).reduce(func, target)
	},
	resolve(...path) {
		return path.reduce((keys, key, index, path) => {
			if (typeof key === "function")
				return key(keys, index, path)
			return keys.concat(this.keys(key))
		}, [])
	},
	keys(path = []) {
	    if (Array.isArray(path)) {
	        return path
	    } else if (typeof path === 'string') {
	        return path === "." || path === ""
	            ? []
	            : path.split('.')
	    } else if (typeof path === 'number') {
			return [String(path)]
		}

	    return []
	},
	apply(path, trap, target, ...args) {
		return this.keys(path).reduce((target, key, index, keys) => {
			if (index === keys.length - 1)
				return trap(target, key, ...args)

			return target[key]
		}, target)
	}
}

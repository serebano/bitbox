export default {
	get(target, key, transform) {
		return transform
			? transform(target[key])
			: target[key]
	},
	has(target, key) {
		return key in target
	},
	keys(target, key) {
		return Object.keys(target[key])
	},
	values(target, key) {
		return Object.values(target[key])
	},
	set(target, key, value) {
		return target[key] = value
	},
	inc(target, key, value = 1) {
		if (!(key in target))
			target[key] = 0

		return target[key] = target[key] + value
	},
	dec(target, key, value = 1) {
		return target[key] = target[key] - value
	},
	push(target, key, ...args) {
		return target[key].push(...args)
	},
	unshift(target, key, ...args) {
		return target[key].unshift(...args)
	},
	pop(target, key) {
		return target[key].pop()
	},
	shift(target, key) {
		return target[key].shift()
	},
	concat(target, key, ...args) {
		return target[key] = target[key].concat(args)
	},
	assign(target, key, ...args) {
		return target[key] = Object.assign(target[key], ...args)
	},
	create(target, key, ...args) {
		return target[key] = Object.create(...args)
	},
	delete(target, key) {
		return (delete target[key])
	},
	unset(target, key) {
		return (delete target[key])
	},
	toArray(target, key) {
		return target[key] = Object.keys(target[key]).map(k => target[key][k])
	}
}

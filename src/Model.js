//import Tag from './Tag'
import { ensurePath, isComplexObject } from './utils'

function Model(type, target = {}, store = {}) {

	const changes = store.changes || []
	const _update = Model.update(target, type)
	const update = (...args) => {
		const e = _update(...args)

		if (e.changed)
			changes.push(e)

		return e
	}

	function __update(path, operator, ...args) {

		if (typeof operator !== "function")
			throw new Error(`Cannot update ${type}, missing operator`)

		path = ensurePath(path)
		args = args.map(store.resolve.value)

		const change = {
			type: type,
			path: path,
			args: args,
			timestamp: Date.now(),
			operator: operator.displayName || operator.name,
			forceChildPathUpdates: false
		}

		if (!path.length) {
			const currentValue = target[type]

			operator(target, type, ...args)

			if (target[type] !== currentValue)
				changes.push(change)

			return change
		}

		path.reduce((currentState, key, index) => {
			if (index === path.length - 1) {
				const currentValue = currentState[key]

				operator(currentState, key, ...args)

				if (currentState[key] !== currentValue || (isComplexObject(currentState[key]) && isComplexObject(currentValue)))
					changes.push(change)

			} else if (!currentState[key]) {
				throw new Error(`The path "${path}" is invalid, can not update state. Does the path "${path.splice(0, path.length - 1).join('.')}" exist?`)
			}

			return currentState[key]
		}, target[type])

		return change
	}

    const model = {
		get: Model.get(target, type),
		set(path, value) {
			update(path, Model.operators.set, value)
		},
		has(path) {
			return model.get(path, value => value)
		},
		provider(options) {
			function provider(context, action) {
				context[type] = {
					get: model.get,
					has: model.has,
					set(path, value) {
						debug(update(path, Model.operators.set, value), context, action)
					},
					update(...args) {
						debug(update(...args), context, action)
					}
				}

	            return context
			}

			provider.toString = () => `${type}Model`

			return provider
        },
		type,
		update
    }

	return model
}

Model.get = function createGet(target, type) {
	return function get(path, transform) {
		const value = ensurePath(path)
			.reduce((state, key, index) => state
				? state[key]
				: undefined,
			target[type])

		return transform
			? transform(value)
			: value
	}
}

Model.update = function(target, type) {

	function update(path, operator, ...args) {
		if (typeof path === "function")
			return update([], ...arguments)

		if (typeof operator !== "function")
			throw new Error(`Cannot update ${type}, missing operator`)

		path = ensurePath(path)

		const change = {
			type: type,
			path: path,
			args: args,
			timestamp: Date.now(),
			operator: operator.displayName || operator.name,
			forceChildPathUpdates: false
		}

		if (!path.length) {
			const currentValue = target[type]

			operator(target, type, ...args)

			if (target[type] !== currentValue)
			 	change.changed = true

			return change
		}

		path.reduce((currentState, key, index) => {
			if (index === path.length - 1) {
				const currentValue = currentState[key]

				operator(currentState, key, ...args)

				if (currentState[key] !== currentValue || (isComplexObject(currentState[key]) && isComplexObject(currentValue)))
					change.changed = true

			} else if (!currentState[key]) {
				throw new Error(`The path "${path}" is invalid, can not update state. Does the path "${path.splice(0, path.length - 1).join('.')}" exist?`)
			}

			return currentState[key]
		}, target[type])

		return change
	}

	return update
}

Model.operators = {
	set(target, key, value) {
		target[key] = value
	},
	inc(target, key, value) {
		target[key] =+ value || 1
	},
	dec(target, key, value) {
		target[key] =- value || 1
	},
	push(target, key, ...args) {
		target[key].push(...args)
	},
	unshift(target, key, ...args) {
		target[key].unshift(...args)
	},
	pop(target, key) {
		target[key].pop()
	},
	shift(target, key) {
		target[key].shift()
	},
	concat(target, key, ...args) {
		target[key] = target[key].concat(args)
	},
	assign(target, key, ...args) {
		Object.assign(target[key], ...args)
	},
	create(target, key, ...args) {
		target[key] = Object.create(...args)
	},
	delete(target, key, ...args) {
		delete target[key]
	},
	toArray(target, key) {
		target[key] = Object.keys(target[key]).map(k => target[key][k])
	},
}


function debug(e, context, action) {

	if (context && context.execution) {
		if (action)
			e.action = action.name
		e.signal = context.execution.name
		e.execution = context.execution.id
	}

	if (context && context.debug) {
		context.debug({
			type: 'mutation',
			target: e.type,
			method: e.operator,
			args: [ e.path, ...e.args ]
		})
	}
}

export function factory(model, operator) {
	const action = (target, ...args) => {
		model.update(target, operator, ...args)
	}

	action.operator = operator
	action.displayName = operator.name
	action.toString = () => `function ${operator.name}(...args) {}`
	model[operator.name] = action

	return model
}

const foo = {
	inc(target, key, value = 1) {
		target[key] = (target[key] || 0) + value
	},
	dec(target, key, value = 1) {
		target[key] = (target[key] || 0) - value
	}
}

Model.assign = (model, object) => Object.keys(object).reduce((model, key) => {
	return factory(model, object[key])
}, model)

Model.foo = foo
Model.factory = factory

export default Model

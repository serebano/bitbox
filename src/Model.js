import Tag from './Tag'
import { ensurePath, isComplexObject } from './utils'

function Model(type, target = {}, store = {}) {

	const changes = store.changes || []

	function update(...args) {
		const operator = args.pop()

		if (typeof operator !== "function")
			throw new Error(`${type}.update missing operator`)

		args = args.map((arg, idx) => {
			if (idx === 0 && arg instanceof Tag && arg.type !== type)
				throw new Error(`Cannot get path for tag ${arg.type} in ${type} model`)

			return arg instanceof Tag
				? idx === 0
					? arg.path(store)
					: arg.get(store)
				: arg
		})

		const path = ensurePath(args.shift())

		const change = {
			type: type,
			path: path,
			args: args,
			timestamp: Date.now(),
			operator: operator.name,
			forceChildPathUpdates: false
		}

		if (!path.length) {
			operator(target, type, ...args)
			changes.push(change)

			return change
		}

		path.reduce((currentState, key, index) => {
			if (index === path.length - 1) {
				const currentValue = currentState[key]

				operator(currentState, key, ...args)

				if (currentState[key] !== currentValue ||
					isComplexObject(currentState[key]) &&
					isComplexObject(currentValue)) {

					changes.push(change)
				}

			} else if (!currentState[key]) {
				throw new Error(`The path "${path}" is invalid, can not update state. Does the path "${path.splice(0, path.length - 1).join('.')}" exist?`)
			}

			return currentState[key]

		}, target[type])

		return change
	}

	function set(target, key, value) {
		target[key] = value
	}

    const model = {
		get(path, transform) {
			const value = ensurePath(path)
				.reduce((state, key, index) => state
					? state[key]
					: undefined,
				target[type])

			return transform ? transform(value) : value
		},
		set(path, value) {
			update(path, value, set)
		},
		has(path) {
			return model.get(path, value => value)
		},
		provider(options) {
			return function modelProvider(context, action) {
				context[type] = {
					get: model.get,
					has: model.has,
					set: (...args) => debug(update(...args, set), context, action),
					update: (...args) => debug(update(...args), context, action)
				}

	            return context
			}
        },
		type,
		update
    }

	return model
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
		model.update(target, ...args, operator)
	}

	action.operator = operator
	action.displayName = operator.name
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

import { ensurePath, isComplexObject } from '../utils'
import handler from './handler'
import get from './get'
import getWith from './getWith'
import create from './create'

function Model(type, target = {}, store = {}) {
	if (!target[type])
		target[type] = {}

	const changes = store.changes || []
	const _update = Model.update(target, type)

	const update = (...args) => {
		return;
		const e = _update(...args)

		if (e.changed) {
			changes.push(e)
			changes.commit()
		}

		return e
	}

    const model = {
		provider(options) {
			function provider(context, action) {
				context[type] = model

				if (context.debugger) {
					context[type] = Model.assign({
						get: model.get,
						has: model.has,
						update(...args) {
							debug(update(...args), context, action)
						}
					}, handler, function(operator) {
						return (path, ...args) => debug(update(path, operator, ...args), context, action)
					})
				}

	            return context
			}

			provider.toString = () => `${type}Model`

			return provider
        },
		type,
		//update
    }

	return Model.assign(
		model,
		handler,
		function create(trap) {
			return function(path, ...args) {
				console.log(`${type} trap`, target[type], trap.name, path, args)
				if (!path || path === "" || path === ".")
					return getWith(target, type, trap, ...args)

				return getWith(target[type], path, trap, ...args)
			}
		}
	)
}

Model.assign = function assign(model, handler, create) {
	return Object.keys(handler).reduce((model, key) => {
		model[key] = create(handler[key])

		return model
	}, model)
}

Model.get = get
Model.create = create
Model.getWith = getWith
Model.handler = handler

Model.update = function Update(target, type) {

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
		//model.update(target, operator, ...args)
	}

	action.operator = operator
	action.displayName = operator.name
	action.toString = () => `function ${operator.name}(...args) {}`
	model[operator.name] = action

	return model
}

Model._assign = (model, object) => Object.keys(object).reduce((model, key) => {
	return factory(model, object[key])
}, model)

Model.factory = factory

export default Model

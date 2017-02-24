import Tag from '../Tag'
import {isObject} from '../utils'
import * as tags from '../tags'

const nextAction = result => result

function PropsProvider(context, action, props) {
	context.props = props || {}

	return context
}

// export function ContextFactory(...providers) {
// 	function Context(action, ...args) {
// 		if (!(this instanceof Context))
// 			return new Context(...arguments)
//
// 		const context = Context.providers.reduce((context, Provider) => {
// 			if (Provider(context, action, ...args) !== this)
// 				throw new Error(`Provider(${Provider.name}) must return context`)
// 			return context
// 		}, this)
//
// 		return typeof action === "function"
// 			? action(context, ...args)
// 			: context
// 	}
//
// 	Context.providers = providers
//
// 	return Context
// }

export function ContextFactory(...providers) {
	function Context(action, ...args) {
		const context = Context.providers.reduce((context, Provider) => {
			if (Provider(context, action, ...args) !== context)
				throw new Error(`Provider(${Provider.name}) must return context`)
			return context
		}, {})

		return typeof action === "function"
			? action(context, ...args)
			: context
	}

	Context.providers = providers

	return Context
}

createRun.Context = ContextFactory

/*
	obj = { name: 'Serebano', age: 32 }
	run = action.createRun()

	run( props`keyVals`.set(compute({
		values: props`.`.get(values),
		keys: props`.`.get(keys)
	})), obj)

 */
export default function createRun(...providers) {

	//run.providers = providers
	run.action = runAction
	run.chain = runChain
	run.context = ContextFactory(...providers)

	function run(target, props, next) {

		if (target instanceof Tag)
			return runAction(context => target.get(context), props, next)

		if (typeof target === 'function')
			return runAction(target, props, next)

		if (Array.isArray(target))
			return runChain(target, props, next)

		throw new Error(`Invalid target`)
	}

	function runAction(action, props = {}, next = nextAction) {
		if (action instanceof Tag)
			return runAction(context => action.get(context), props, next)

		const result = run.context(action, props)
		//const result = action(context, tags)

		if (typeof result === "function") return runAction(result, props, next)
		if (result instanceof Promise) return result.then(next)

		return next(result)
	}

	function runChain(chain, payload, next = nextAction, index = 0) {
		const item = chain[index]
		const runNext = (result) => {
			const props = isObject(result)
			 	? Object.assign({}, payload, result)
				: result
					? Object.assign({}, payload, {result})
					: payload
			return runChain(chain, props.result||props, next, index + 1)
		}

		if (!item) return next(payload)
		if (Array.isArray(item)) return runChain(item, payload, runNext, 0)

		return runAction(item, payload, runNext)
	}

	return run
}

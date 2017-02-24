import Tag from '../Tag'
import {isObject} from '../utils'
import * as tags from '../tags'

const nextAction = result => result


export function ContextFactory(...providers) {
	function Context(action, ...args) {
		const context = Context.providers.reduce((context, Provider) => {
			if (Provider(context, action, ...args) !== context)
				throw new Error(`Provider(${Provider.name}) must return context`)
			return context
		}, new Tag.Context())

		if (action instanceof Tag)
			return action.get(context)

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

	function run(target, props = {}, next) {
		if (target instanceof Tag || typeof target === 'function')
			return runAction(target, props, next)

		if (Array.isArray(target))
			return runChain(target, props, next)

		throw new Error(`Invalid target`)
	}

	function runAction(action, props = {}, next = nextAction) {
		if (action instanceof Tag)
			return runAction(function getTag(context) {
				return action.get(context)
			}, props, next)

		const result = run.context(action, props)

		if (typeof result === "function") return runAction(result, props, next)
		if (result instanceof Promise) return result.then(next)
		if (Array.isArray(result)) return runChain(result, props, next, 0)

		return next(result)
	}

	function runChain(chain, props, next = nextAction, index = 0) {
		const item = chain[index]
		const runNext = (result) => {
			props.result = result
			return runChain(chain, props, next, index + 1)
		}

		if (!item) return next(props)
		if (Array.isArray(item)) {
			return runChain(item, props, runNext, 0)
		}

		return runAction(item, props, runNext)
	}

	return run
}

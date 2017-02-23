import Tag from '../Tag'
import {isValidResult,isObject} from '../utils'
import tags from '../tags'

const nextAction = result => result

function PropsProvider(context, action, props) {
	context.props = props || {}
	return context
}

export function ActionContext(providers, action, props) {
	[ PropsProvider ]
		.concat(providers)
		.reduce((context, Provider) => Provider(context, {action}, props), this)
}

/*
	obj = { name: 'Serebano', age: 32 }
	run = action.createRun()

	run( props`keyVals`.set(compute({
		values: props`.`.get(values),
		keys: props`.`.get(keys)
	})), obj)

 */
export default function createRun(...providers) {

	run.providers = providers
	run.action = runAction
	run.chain = runChain
	run.context = (action, props) => new ActionContext(providers, action, props)

	function run(chain, props) {
		return runChain([].concat(chain), props)
	}

	function runAction(action, props={}, next = nextAction) {
		if (action instanceof Tag)
			return runAction(context => action.get(context), props, next)

		const context = run.context(action, props)
		const result = action(context, tags)

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

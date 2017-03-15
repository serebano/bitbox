import Tag from '../Tag'
import store from '../app.store'
import {isValidResult} from '../utils'
import tags from '../tags'

function propsProvider(context, action, props) {
	context.props = props || {}

	return context
}

export function ActionContext(providers, action, props) {
	[ propsProvider ]
		.concat(providers)
		.reduce((context, provider) => provider(context, {action}, props), this)
}

const nextAction = result => result

/*
	obj = { name: 'Serebano', age: 32 }
	run = action.createRun()

	run( props`keyVals`.set(compute({
		values: props`.`.get(values),
		keys: props`.`.get(keys)
	})), obj)

 */
export function createRun(...providers) {

	run.providers = providers
	run.action = runAction
	run.chain = runChain

	function run(actions, props, done) {
		return runChain([].concat(actions), props, done)
	}

	function runAction(action, props = {}, next = nextAction) {
		const context = new ActionContext(providers, action, props)

		if (action instanceof Tag) return next(action.get(context))

		const result = action(context, tags)

		if (typeof result === "function") return runAction(result, props, next)
		if (result instanceof Promise) return result.then(next)
		if (result === true) return next(props)
		if (isValidResult(result)) return next(result)

		return props
	}

	function runChain(chain, payload, next = nextAction, index = 0) {
		const item = chain[index]
		const runNext = (result) => runChain(chain, Object.assign({}, payload, result), next, index + 1)

		if (!item) return next(payload)
		if (Array.isArray(item)) return runChain(item, payload, runNext)

		return runAction(item, payload, runNext)
	}

	return run
}


// foo = state`app.${props`key`}`.set(compute({ props: props`.`, name: state`app.name` }))
// runAction( foo, { key: 'xxx' } )
// runAction( state`app.name`.set(props`x`.get(String)), { x: 3 } )

export function runAction(action, props, next = nextAction) {
	if (action instanceof Tag)
		return runAction(context => action.get(context), props, next)

	const context = store.context(action, props)
	const result = action(context, tags)

	if (typeof result === "function")
		return runAction(result, props, next)

	if (result === true)
		return next(props)

	if (result instanceof Promise)
		return result.then(next)

	if (isValidResult(result))
		return next(result)

	return props
}

// runChain( [ action1, action2 ] )

export function runChain(chain, payload, next = nextAction, index = 0) {
	const item = chain[index]
	const runNext = result => runChain(chain, Object.assign({}, payload, result), next, index + 1)

	if (!item)
		return next(payload)

	if (Array.isArray(item))
		return runChain(item, payload, runNext, 0)

	return runAction(item, payload, runNext)
}

// run( state`app.n`.set( compute({ props: props`.`, name: state`app.name` }) ), { dd:2, j:0 })
/*
	foo = state`app.${props`key`}`
	bar = compute({
		props: props`.`,
		name: state`app.name`
	})

	run([
  		getRepo,
  		state`app.repo`.set( props`data.owner.html_url`.get( s => s.toUpperCase() ) ),
  		foo.set( bar.get( Object.keys ) ),
  		state`foocopy`.set( foo ),
		state`fooValues`.set( bar.get( Object.values ) )
	],
	{ name: 'fun', key: 'cool' })

 */


export function run(chain, props) {
	return runChain([].concat(chain), props)
}

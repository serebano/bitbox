import Tag from '../Tag'
import DependencyStore from '../deps'
import createRun from '../action'
import * as tags from '../tags'

function absolutePath(tag, context) {
	return tag.type + "." + tag.path(context)
}

/*
	deps = compute({
		name: state`app.name`,
		color: state`app.color`
	})

	store.on(deps, props => console.log('on', props))
	store.set(name: state`app.name`, 'My App')

 */

function Store(init = {}, ...providers) {

	const store = {
		path(target, props) {
			return target.path(store.run.context({}, props))
		},
		paths(target, props) {
			return target.paths(store.run.context({}, props))
		},
		tags(target, props) {
			return target.tags(store.run.context({}, props))
		},
		get(target, props) {
			return target.get(store.run.context({}, props))
		},
		set(target, value, props) {
			target.set(store.run.context({}, props), value)

			return store.deps.commit()
		},
		connect(target, listener) {
			const paths = store.paths(target)
			return store.deps.add(listener, ...paths)
		},
		apply(fn, props) {
			return fn(store.run.context(fn, props))
		}
	}

	const deps = new DependencyStore()

	function provider(context, action, props) {
		context.props = props
		context.store = store

		context.path = (target) => target.path(context)
		context.get = (target) => target.get(context)
		context.set = function set(target, value) {

			if (value instanceof Promise)
				return value.then(v => context.set(target, v))

			if (value instanceof Tag)
	            return context.set(target, value.get(context))

			const result = target.handlers.set.call(target, context, value)

			observer('set', target, context, value)

			return result
		}

		return context
	}

	const run = createRun(provider, ...providers)

	store.module = {}
	store.deps = deps
	store.run = run


	Tag.observe(tags.props, observer)
	Tag.observe(tags.state, observer)
	Tag.observe(tags.signal, observer)
	Tag.observe(tags.module, observer)

	store.set(tags.module`.`, init)

	function observer(handler, target, context, details) {
		const path = absolutePath(target, context)

		const index = handler === "set" && deps.push(path)
		if (index[1] === 0)
			console.log(`\n***`)
		if (handler !== "get:cached")
			console.log(`%c${handler.toUpperCase()} %c${target.type}%c \`${target.pathToString()}\`%c`, `color:${handler==="set"?"orange":handler==="get:cached"?"#555":"lime"};font-weight:bold;`, `font-weight:bold`, `color:${handler==="get:cached"?"#777":"#999"}`, '', details)
	}

	return store
}

Store.provider = (store) => {
	return (context, action, props) => {
		context.get = (target) => store.get(target, props)
		context.set = (target, value) => {
			store.set(target, value, props)
		}
		context.path = (target) => store.path(target, props)

		context.store = store
		context.state = store.module.state

		return context
	}
}

// store.connect = function connect(arg, comp) {
// 	if (!comp.tag) {
//
// 		comp.tag = tags.compute(arg)
// 		comp.deps = comp.tag.deps(store.context())
// 		comp.remove = () => deps.remove(comp, comp.deps)
// 		comp._update = (changes) => comp(store.get(comp.tag), changes)
//
// 		deps.register(comp, comp.deps)
//
// 	} else {
//
// 		const prevMap = comp.deps
// 		comp.tag = tags.compute(arg)
// 		comp.deps = comp.tag.deps(store.context())
//
// 		deps.update(comp, prevMap, comp.deps)
// 	}
//
// 	return comp
// }

export default Store

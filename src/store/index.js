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
		path(tag, props) {
			return tag.path(store.run.context({}, props))
		},
		get(tag, props) {
			return tag.get(store.run.context({}, props))
		},
		set(tag, value, props) {
			tag.set(store.run.context({}, props), value)

			return store.deps.commit()
		},
		on(tag, fn) {
			const path = store.path(tag)
			const deps = tag.deps(store.run.context())
			const entity = () => fn(store.get(tag))

			entity.deps = deps
			entity.toString = () => `on(${tag}, ${fn})`
			entity.on = () => store.deps.add(entity, deps)
			entity.off = entity.on()

			return entity
		},
		apply(fn, props) {
			return fn(store.run.context(fn, props))
		}
	}

	const deps = new DependencyStore()
	const run = createRun(Store.provider(store), ...providers)

	store.module = {}
	store.deps = deps
	store.run = run

	Tag.observe(tags.props, observer)
	Tag.observe(tags.state, observer)
	Tag.observe(tags.signal, observer)
	Tag.observe(tags.module, observer)

	store.set(tags.module`.`, init)

	function observer(handler, tag, context, details) {
		const path = absolutePath(tag, context)

		const index = handler === "set" && deps.push(path)
		if (index[1] === 0)
			console.log(`\n***`)
		if (handler !== "get:cached")
			console.log(`%c${handler.toUpperCase()} %c${tag.type}%c \`${tag.pathToString()}\`%c`, `color:${handler==="set"?"orange":handler==="get:cached"?"#555":"lime"};font-weight:bold;`, `font-weight:bold`, `color:${handler==="get:cached"?"#777":"#999"}`, '', details)
	}

	return store
}

Store.provider = (store) => {
	return (context, action, props) => {
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

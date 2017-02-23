import Tag from '../Tag'
import createDependencyStore from '../deps'
import tags, {module} from '../tags'
import {isValidResult} from '../utils'
import createRun from '../action'

function Store(init = {}, ...providers) {

	const store = {
		path(tag, props, absolute) {
			return absolute
				? tag.type + "." + tag.path(store.run.context({ type:"store.path" }, props))
				: tag.path(store.run.context({ type:"store.set" }, props))
		},
		get(tag, props) {
			return tag.get(store.run.context({ type:"store.get" }, props))
		},
		set(tag, value, props) {
			tag.set(store.run.context({ type:"store.set" }, props), value)
			deps.commit()
		}
	}

	const deps = createDependencyStore()
	const run = createRun(Store.provider(store), ...providers)

	store.module = {}
	store.deps = deps
	store.run = run

	Tag.observe(tags.props, observer)
	Tag.observe(tags.state, observer)
	Tag.observe(tags.signal, observer)
	Tag.observe(tags.module, observer)

	store.set(module`.`, init)

	function observer(handler, tag, context, details) {
		const path = store.path(tag, {}, true)
		const index = handler === "set" && deps.push(path)
		if (index[1] === 0)
			console.log(`\n***`)
		if (handler !== "get:cached")
			//console.log(`[cached]`)
		//else
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

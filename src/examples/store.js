import Tag from '../Tag'
import createDependencyStore from '../Deps'
//import {set} from '../operators'
import tags, {module} from '../tags'

function createStore(storeFactory = {}, providers = []) {

	const deps = createDependencyStore()

	const store = {
		deps,
		tags,
		module: {},
		context(props = {}) {
			return providers.reduce((context, provider) => provider(context), {
				store: store,
				state: store.module.state,
				props: props
			})
		},
		action(action, props) {
			const result = action(store.context(props))
			deps.commit()

			return result
		},
		connect(arg, comp) {
			if (!comp.tag) {

				comp.tag = tags.compute(arg)
				comp.deps = comp.tag.deps(store.context())
				comp.remove = () => deps.remove(comp, comp.deps)
			 	comp._update = (changes) => comp(store.get(comp.tag), changes)

				deps.register(comp, comp.deps)

			} else {

				const prevMap = comp.deps
				comp.tag = tags.compute(arg)
				comp.deps = comp.tag.deps(store.context())

				deps.update(comp, prevMap, comp.deps)
			}

			return comp
		},
		path(tag, absolute) {
			return absolute
				? tag.type + "." + tag.path(store.context())
				: tag.path(store.context())
		},
		get(tag, props) {
			if (typeof tag === "function" && tag.tag instanceof Tag)
				return tag(store.get(tag.tag, props))

			return tag.get(store.context(props))
		},
		set(tag, value, props) {
			return tag.set(store.context(props), value) && deps.commit()
		},
		run(name, chain, props = {}) {
			return Promise.all(chain.map(action => {
				const result = action instanceof Tag
					? store.get(action, props)
					: action(store.context(props))
				if (result instanceof Promise) {
					result.then(result => {
						return Object.assign(props, result)
					})
				}
				return Object.assign(props, result)
			})).then((result) => {
				deps.commit()
				return result
			})
		}
	}

	Tag.observe(tags.props, observer)
	Tag.observe(tags.state, observer)
	Tag.observe(tags.signal, observer)
	Tag.observe(tags.module, observer)

	function observer(handler, tag, context, details) {
		const path = store.path(tag, true)
		const index = handler === "set" && deps.push(path)
		if (index[1] === 0)
			console.log(`\n***`)
		if (handler === "get:cached")
			console.log(`[cached]`)
		else
			console.log(`%c${tag.type} %c\`${tag.pathToString()}\`%c`, `color:${handler==="set"?"orange":handler==="get:cached"?"#555":"lime"};font-weight:bold;`, `color:${handler==="get:cached"?"#777":"#eee"}`, '', [handler,details])
	}

	store.set(module`.`, storeFactory)

	return store
}

export default createStore

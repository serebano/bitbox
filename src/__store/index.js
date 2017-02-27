import Tag from '../Tag'
import Run from '../Run'
import DependencyStore from '../deps'
import * as tags from '../tags'
import {absolutePath} from '../utils'
import ResolveProvider from '../providers/resolve'
/*
	deps = compute({
		name: state`app.name`,
		color: state`app.color`
	})

	store.on(deps, props => console.log('on', props))
	store.set(state`app.name`, 'My App')

 */

function StoreProvider(store = { module: {} }) {
    function storeProvider(context, action, props) {
        context.props = props || {}
        context.store = store

		context.get = function get(target) {
			return target.get(context)
		}

        context.set = function set(target, value) {
            if (!target.set)
                throw new Error(`${target} does not provide set`)

            target.set(context, value)

            const path = target.path(context, false)

            return store.deps.emit(path && path !== "."
				? (target.type + "." + path)
				: target.type)
        }

        return context
    }

    return storeProvider
}

Store.Provider = StoreProvider

function Store(init = {}, ...providers) {

	const store = {
        module: {},
        deps: new DependencyStore()
    }

	const run = Run(Store.Provider(store), ResolveProvider, ...providers)

	store.get = (target, props) => target.get(run.context(null, props))
	store.set = (target, value, props) => run(context => target.set(context, value), props)

	store.set(tags.module `.`, init)

	store.connect = (target, listener) => store.deps.add(listener, ...store.paths(target))
	store.on = (target, listener) => store.deps.add(c => listener(store.get(target)), ...store.paths(target))

	store.path = (target, props) =>  target.path(run.context(null, props))
	store.paths = (target, props) => target.paths(run.context(null, props))
	store.tags = (target, props) => target.tags(run.context(null, props))

	store.context = run.context
	store.run = (action, props, done) => run(action, props, result => {
        console.log(`result`, result)
        return store.deps.commit()
    })

	return store
}

export default Store



// function observer(handler, target, context, details) {
// 	const path = absolutePath(target, context)
//
// 	const index = handler === "set" && deps.push(path)
// 	if (index[1] === 0)
// 		console.log(`\n***`)
// 	if (handler !== "get:cached")
// 		console.log(`%c${handler.toUpperCase()} %c${target.type}%c \`${target.pathToString()}\`%c`, `color:${handler==="set"?"orange":handler==="get:cached"?"#555":"lime"};font-weight:bold;`, `font-weight:bold`, `color:${handler==="get:cached"?"#777":"#999"}`, '', details)
// }

import React from 'react'
import {render} from 'react-dom'
import {Container} from './Component'
import * as tags from './tags'
import * as ops from './operators'

import Model from './Model'

import {compute,state} from './tags'
import {set,inc,wait,sequence,parallel,push} from './operators'

// import store from './demo/store'
// import App from './demo/components/App'

import store from './examples/counter/store'
import App from './examples/counter/App'
import computed from './examples/compute'

const {run} = store

const target = compute(computed)

store.connect(target, function Target(changes) {
	// target.value = {}
	// const paths = store.paths(target)
	// const changed = changes.map(c => c.path.join(".")).filter(path => paths.indexOf(path) > -1)
	// console.log('(on-target)', paths, changed)
	// if (changed.length) {
	// 	changed.forEach(path => {
	// 		const keys = path.split(".")
	// 		const type = keys.shift()
	// 		if (store[type]) {
	// 			const value = store[type].get(keys)
	// 			target.value[path] = value
	// 			console.info(`changed(%c${path}%c)`, `color:yellow`, ``, value)
	// 		}
	// 	})
	// }
	//store.resolve(target, {}, changes).then(resolved => console.log('(on-target)', resolved))
})

// window.__ = { app: {name:'myapp', count: 10} }
// window.__ctx = {}
//
// const app = window.app = Model('app', { app: {name:'myapp', count: 10} })
// //app.set = set
// app.provider(window.__ctx)
//
// app.print = function(path, ident = 4) {
// 	return this.get(path, value => JSON.stringify(value, null, ident))
// }

//app.set('count', 300)

const appTarget = compute({
	count: state`count`
})

const appConn = store.connect(appTarget,
	function Scooby(changes) {
		const u = appConn.update(store.paths(appTarget))

		console.log(`Appxx`, changes, u)
	}
)

appTarget.add('color', state`color`)
appConn.update(store.paths(appTarget))

window.appConn = appConn
window.appTarget = appTarget

// run(set(state`app`, { foo: { bar: {} } }))
// run(set(state`app.foo.bar.count`, 1))
// run(set(state`app.foo.baz`, ['a','b','c']))
// run(set(state`app.foo.baz.3`, 'd'))
//
// run(push(state`app.foo.baz`, Date.now()))

// store.state.changes('app.foo.bar.count')
// store.state.changes('app.foo.*.count')
// store.state.changes('app.foo.*')

//store.run(set(state`color`, 'red'))

// setTimeout(() => {
//
// 	store.run(set(state`app`, {count:9}))
// 	store.run(inc(state`app.count`))
//
// 	store.run('ww', [
// 		parallel('p1',
// 			wait(3000), {
// 				then: [],
// 				continue: [
// 					set(state`a`, 1)
// 				]
// 			},
// 			set(state`user`, {
// 				firstName: 'Sereb',
// 				lastName: 'Toder'
// 			})
// 		)
// 	])
//
// }, 1000)

Object.assign(window, { Model, run, sequence, parallel, store, App, target }, tags, ops)

render((
	<Container store={store} >
		<App />
	</Container>
), document.querySelector('#root'))

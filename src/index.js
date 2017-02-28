import React from 'react'
import {render} from 'react-dom'
import {Container} from './Component'
import * as tags from './tags'
import * as ops from './operators'

import {compute,state} from './tags'
import {set,inc} from './operators'

// import store from './demo/store'
// import App from './demo/components/App'

import store from './examples/counter/store'
import App from './examples/counter/App'
import computed from './examples/compute'

store.action(set(state`user`, {
	firstName: 'Sereb',
	lastName: 'Toder'
}))

const target = compute(computed)

store.connect(target, (changes) => {
	target.value = {}
	const paths = store.paths(target)
	const changed = changes.map(c => c.path.join(".")).filter(path => paths.indexOf(path) > -1)
	console.log('(on-target)', paths, changed)
	if (changed.length) {
		changed.forEach(path => {
			const keys = path.split(".")
			const type = keys.shift()
			if (store[type]) {
				const value = store[type].get(keys)
				target.value[path] = value
				console.info(`changed(%c${path}%c)`, `color:yellow`, ``, value)
			}
		})
	}
	//store.resolve(target, {}, changes).then(resolved => console.log('(on-target)', resolved))
})

store.action(set(state`app`, {count:9}))
store.action(inc(state`app.count`))

Object.assign(window, { store, App, target }, tags, ops)

render((
	<Container store={store} >
		<App />
	</Container>
), document.querySelector('#root'))

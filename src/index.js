import React from 'react'
import {render} from 'react-dom'
import {Container} from './Component'
import * as tags from './tags'
import {compute,state,props} from './tags'
import * as ops from './operators'
import Model from './model/create'
import Path from './model/path'
import Store from './Store'

import store from './examples/counter/store'
import App from './examples/counter/App'

const countProps = compute({
	name: state`name`,
	count: state`count`,
	id: props`id`
})

function onCount(e) {
	onCount.renew()

	const props = store.get(countProps, {
		id: 'xxxxx'
	})

	render((
		<section>
			<h2>NAME: {props.name} [{props.id}]</h2>
			<h3>COUNT: {props.count}</h3>
		</section>
	), document.querySelector('#dev'))
}

store.connect(countProps, onCount)

Object.assign(window, { Store, store, Path,  Model, onCount }, tags, ops)

render((
	<Container store={store} >
		<App />
	</Container>
), document.querySelector('#root'))

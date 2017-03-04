import React from 'react'
import {render} from 'react-dom'
import {Container} from './Component'
import * as tags from './tags'
import * as ops from './operators'
import Model from './model/create'
import Path from './model/path'

import store from './examples/counter/store'
import App from './examples/counter/App'


function onCount(e) {
	onCount.update(onCount.paths)
	render((
		<section>
			<h1>onCOUNT: {store.state.get('count')}</h1>
		</section>
	), document.querySelector('#dev'))
}

store.changes.on('state.count', onCount)

onCount.add('state.name')

Object.assign(window, { store, Path,  Model, onCount }, tags, ops)

render((
	<Container store={store} >
		<App />
	</Container>
), document.querySelector('#root'))

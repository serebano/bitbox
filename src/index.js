import React from 'react'
import {render} from 'react-dom'
import {Container} from './Component'
import * as tags from './tags'
import * as ops from './operators'

// import store from './demo/store'
// import App from './demo/components/App'

import store from './examples/counter/store'
import App from './examples/counter/App'

Object.assign(window, { store, App }, tags, ops)

render((
	<Container store={store} >
		<App />
	</Container>
), document.querySelector('#root'))

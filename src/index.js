import React from 'react'
import {render} from 'react-dom'
import {Container} from './Component'
import store from './examples/counter/store'
import App from './examples/counter/App'

import * as tags from './tags'
import * as operators from './operators'


Object.assign(window, { store, App }, tags, operators)


render((
	<Container store={store} >
		<App />
	</Container>
), document.querySelector('#root'))

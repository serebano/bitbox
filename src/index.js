import React from 'react'
import {render} from 'react-dom'
import {Container} from './Component'

import store from './demo/store'
import App from './demo/components/App'
import * as tags from './tags'

Object.assign(window, {store,App}, tags)

render((
	<Container store={store} >
		<App />
	</Container>
), document.querySelector('#root'))

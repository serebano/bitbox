import React from 'react'
import {render} from 'react-dom'
import Container from './component/container'
import store from './app.store'
import App from './app.view'

window.store = store
window.App = App

render((
	<Container store={store}>
    	<App user="Serebano" />
	</Container>
), document.querySelector('#root'))

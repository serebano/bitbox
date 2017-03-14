import React from 'react'
import {render} from 'react-dom'
import {Container} from '../../Component'

import store from './store'
import App from './App'

render((
    <Container store={store}>
        <App />
    </Container>
), document.querySelector('#root'))

import Store from '../../Store'
import Devtools from '../../devtools'
import { state, props } from '../../tags'
import { wait, sequence, parallel, set } from '../../operators'
import Counts from './counts'

function increase({ state, props }) {
    state.set('count', state.get('count') + (props.by || 1))
}

function decrease({ state, props }) {
    state.set('count', state.get('count') - (props.by || 1))
}

const store = Store({
    state: {
        count: 0
    },
    signals: {
        increaseClicked: [
            sequence(`Increase count`, increase)
        ],
        decreaseClicked: [
            parallel('Clicked',
                set(state`loading`, true),
                parallel(`Decrease count`, wait(props`delay`), decrease),
                set(state`loading`, false)
            )
        ]
    },
    modules: {
        counts: Counts
    },
    devtools: Devtools({
        ///remoteDebugger: '192.168.43.152:8686',
        remoteDebugger: 'localhost:8585'
    })
})

export default store

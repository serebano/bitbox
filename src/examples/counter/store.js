import Store from '../../Store'
import { state } from '../../tags'
import counts from './counts'

function increase({ state }) {
    state.set('count', state.get('count') + 1)
}

function decrease({ state }) {
    state.set('count', state.get('count') - 1)
}

const store = Store({
    state: {
        count: 0
    },
    signals: {
        increaseClicked: [ increase ],
        decreaseClicked: [ decrease ]
    },
    modules: {
        counts
    }
})

export default store

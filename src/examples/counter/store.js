import Store from '../../Store'
import { state } from '../../tags'

function increase({ set, get }) {
    set(state`count`, get(state`count`) + 1)
}

function decrease({ set, get }) {
    set(state`count`, get(state`count`) - 1)
}

const store = Store({
    state: {
        count: 0
    },
    signals: {
        increaseClicked: [ increase ],
        decreaseClicked: [ decrease ]
    }
})

export default store

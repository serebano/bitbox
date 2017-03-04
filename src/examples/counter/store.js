import Store from '../../Store'
import Devtools from '../../devtools'
import { state, props } from '../../tags'
import { wait, sequence, parallel, set } from '../../operators'
import Counts from './counts'

function increase({ state, props }) {
    state.apply(`count`, function increment(target, key, by) {
        target[key] = target[key] + by
    }, props.by || 1)
    //state.set('count', state.get('count') + (props.by || 1))
}

function decrease({ apply, props }) {
    apply(state`count`, function decrement(target, key, by) {
        target[key] = target[key] - by
    }, props.by || 1)
    //state.set('count', state.get('count') - (props.by || 1))
}

function Demo(module) {
    return {
        state: {
            module,
            name: 'Demo App',
            items: ['One'],
            count: 0
        },
        signals: {
            increaseClicked: [
                sequence(`Increase count`, increase)
            ],
            decreaseClicked: [
                sequence('Clicked',
                    set(state`loading`, true),
                    parallel(`Decrease count`,
                        wait(props`delay`), {
                            then: [
                                decrease
                            ]
                        }
                    ),
                    set(state`loading`, false)
                )
            ]
        },
        modules: {
            counts: Counts
        },
        devtools: Devtools({
            //remoteDebugger: '192.168.0.46:8585',
            //remoteDebugger: '192.168.43.152:8686',
            remoteDebugger: 'localhost:8585'
        })
    }
}

const store = Store(Demo)

export default store

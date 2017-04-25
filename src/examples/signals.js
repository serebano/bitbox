import { set, unset, or, inc, dec, toggle } from "../operators"
import { state, args, props } from "./app"
import timer from "./components/timer/timer"

function toggleTimer({ state, props, path }) {
    return state.timers[props.id].iid ? path.stop() : path.start()
}

export default {
    nameChanged: set(state.name, args[0].target.value(or("Demo"))),
    incClicked: set(state.count, state.count(inc)),
    decClicked: set(state.count, state.count(dec)),
    toggleClicked: set(state.enabled, state.enabled(toggle)),
    timerRemoved: [set(timer.iid, timer.iid(clearInterval)), unset(state.timers[props.id])],
    timerToggled: [
        toggleTimer,
        {
            start: set(timer.iid, timer(timer => () => timer.value++, setInterval)),
            stop: set(timer.iid, timer.iid(clearInterval))
        }
    ]
}

import bitbox from "../bitbox"
import { set, unset, or, inc, dec, toggle, stringify, map } from "../operators"
import app, { state, args, props, signals } from "./app"
import createSignal from "./run"
import store from "./store"
import Inferno from "inferno"
import component from "../views/inferno"
import App from "./components/app"
import timer from "./components/timer/timer"

export { App, store, app, state, args, props, signals, component }

export const signal = createSignal(function(context, action, props) {
    context.state = store.state

    return context
})

bitbox.observe(app(map(App.map), stringify, console.info), store)

bitbox.set(
    store,
    state.timers,
    state.timers(timers =>
        Object.assign(timers, {
            abc: { value: 200 },
            xxx: { value: 100 }
        })
    )
)

export const signalsDesc = {
    nameChanged: set(state.name, args[0].target.value(or("Demo"))),
    incClicked: set(state.count, state.count(inc)),
    decClicked: set(state.count, state.count(dec)),
    toggleClicked: set(state.enabled, state.enabled(toggle)),
    timerRemoved: [set(timer.iid, timer.iid(clearInterval)), unset(state.timers[props.id])],
    timerToggled: [
        function toggleTimer({ state, props, path }) {
            return state.timers[props.id].iid ? path.stop() : path.start()
        },
        {
            start: set(timer.iid, timer(timer => () => timer.value++, setInterval)),
            stop: set(timer.iid, timer.iid(clearInterval))
        }
    ]
}

Object.keys(signalsDesc).forEach(key => {
    bitbox.set(store, app.signals[key], signal(key, signalsDesc[key]))
})

//component.debug = true
//component.observe = false

Inferno.render(component(App, store, app), document.querySelector("#root"))

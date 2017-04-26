import bitbox, { observable } from "../bitbox"
import app from "./app"
import state from "./state"
import signals from "./signals"

const store = {}

bitbox.set(store, app.state, observable(state))
bitbox.set(store, app.signals, signals)

export default store

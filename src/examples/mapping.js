import { compute } from "../bitbox"
import { array, string } from "../operators"
import { state } from "./app"

export default {
    count: state.count,
    name: state.name(string.toUpper),
    timer: state.timers[state.id],
    items: state.items(Object.keys, array.join(` * `)),
    item: state.nativeSet(Array.from, arr => arr[arr.length - 1]),
    color: state.enabled(enabled => (enabled ? "red" : "green")),
    computed: compute(state.count, state.timers(Object.keys, array.join(" * ")), array.join(" - "))
}

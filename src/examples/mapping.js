import bitbox from "../bitbox"
import { compute, join, toUpper } from "../operators"
import { state } from "./app"

export default bitbox({
    count: state.count,
    name: state.name(toUpper),
    timer: state.timers[state.id],
    items: state.items(Object.keys, join(` * `)),
    computed: bitbox(compute(state.count, state.timers(Object.keys).length, join(" - "))),
    item: state.nativeSet(Array.from, arr => arr[arr.length - 1]),
    color: state.enabled(enabled => (enabled ? "red" : "green"))
})
